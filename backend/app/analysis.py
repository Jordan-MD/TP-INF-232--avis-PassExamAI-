import json
import pandas as pd
import numpy as np
from scipy import stats
from sqlalchemy.orm import Session
from app.models import Response

# ── Helpers ──────────────────────────────────────────────────────────────────

def _parse_json_column(series: pd.Series) -> pd.Series:
    """Transforme une colonne de chaînes JSON en listes Python."""
    return series.apply(lambda x: json.loads(x) if isinstance(x, str) and x.strip() else [])

def _get_distribution(series: pd.Series, explode: bool = False) -> dict:
    """Retourne labels + counts triés par fréquence décroissante."""
    if explode:
        # Pour les colonnes multi-choix (listes)
        data = series.explode().dropna()
    else:
        data = series.dropna()
    
    if data.empty:
        return {"labels": [], "values": []}
    
    counts = data.value_counts()
    return {
        "labels": counts.index.tolist(),
        "values": counts.values.tolist()
    }

def _freq_score(freq: str) -> int:
    """Mappe la fréquence d'usage IA en score numérique."""
    mapping = {
        "jamais": 0,
        "rarement": 1,
        "parfois": 2,
        "souvent": 3,
        "très souvent": 4,
    }
    return mapping.get(str(freq).lower(), 0)

# ── Calcul principal ─────────────────────────────────────────────────────────

def compute_stats(db: Session) -> dict:
    # 1. Chargement des données
    responses = db.query(Response).all()
    total = len(responses)

    if total == 0:
        return {"total": 0}

    # 2. Conversion en DataFrame
    df = pd.DataFrame([r.to_dict() for r in responses])

    # 3. Pré-traitement des colonnes JSON
    json_cols = [
        "outils_ia", "contextes_ia", "dangers_ia", 
        "usage_ia_etudes", "methode_preparation_exam", 
        "freins_ia_etudes", "fonctionnalites_utiles"
    ]
    for col in json_cols:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: x if isinstance(x, list) else [])

    # 4. Distributions simples (champs catégoriels)
    stats_dict = {
        "total": total,
        "dist_niveau_etudes":          _get_distribution(df["niveau_etudes"]),
        "dist_faculte":                _get_distribution(df["faculte"]),
        "dist_genre":                  _get_distribution(df["genre"]),
        "dist_utilise_ia":             _get_distribution(df["utilise_ia"]),
        "dist_frequence_ia_etudes":    _get_distribution(df["frequence_ia_etudes"]),
        "dist_difficulte_preparation": _get_distribution(df["difficulte_preparation"]),
        "dist_utiliserait_app":        _get_distribution(df["utiliserait_app"]),
        "dist_format_prefere":         _get_distribution(df["format_prefere"]),
        "dist_budget_mensuel":         _get_distribution(df["budget_mensuel"]),
    }

    # 5. Distributions multi-choix (JSON explode)
    stats_dict.update({
        "dist_outils_ia":       _get_distribution(df["outils_ia"], explode=True),
        "dist_contextes_ia":    _get_distribution(df["contextes_ia"], explode=True),
        "dist_dangers_ia":      _get_distribution(df["dangers_ia"], explode=True),
        "dist_usage_ia_etudes": _get_distribution(df["usage_ia_etudes"], explode=True),
        "dist_methode_preparation": _get_distribution(df["methode_preparation_exam"], explode=True),
        "dist_freins_ia_etudes":    _get_distribution(df["freins_ia_etudes"], explode=True),
        "dist_fonctionnalites_utiles": _get_distribution(df["fonctionnalites_utiles"], explode=True),
    })

    # 6. Moyennes Likert
    likert_fields = {
        "Connaissance IA":     "niveau_connaissance_ia",
        "IA = Opportunité":    "ia_opportunite",
        "IA = Menace emploi":  "ia_menace_emploi",
        "Confiance IA":        "confiance_ia",
        "IA améliore réussite":"ia_ameliore_reussite",
        "Solution pertinente": "solution_repond_probleme",
    }
    stats_dict["likert_means"] = {
        label: round(df[field].mean(), 2) if field in df.columns else 0.0
        for label, field in likert_fields.items()
    }

    # 7. H1 : Corrélation usage ↔ perception (avec P-value)
    if total >= 2:
        df["freq_score"] = df["frequence_ia_etudes"].apply(_freq_score)
        df["perception_score"] = (
            df["ia_opportunite"].fillna(0) + 
            df["confiance_ia"].fillna(0) + 
            df["niveau_connaissance_ia"].fillna(0)
        ) / 3
        
        corr, p_value = stats.pearsonr(df["freq_score"], df["perception_score"])
        
        # Régression linéaire simple (Y = ax + b)
        slope, intercept, r_value, p_reg, std_err = stats.linregress(df["freq_score"], df["perception_score"])
        
        stats_dict["h1_correlation_usage_perception"] = round(corr, 3)
        stats_dict["h1_p_value"] = round(p_value, 4)
        stats_dict["h1_regression"] = {
            "slope": round(slope, 3),
            "intercept": round(intercept, 3),
            "r_squared": round(r_value**2, 3)
        }
    else:
        stats_dict["h1_correlation_usage_perception"] = 0.0
        stats_dict["h1_p_value"] = 1.0
        stats_dict["h1_regression"] = {"slope": 0, "intercept": 0, "r_squared": 0}

    # 8. H2 : Analyse des méthodes
    # On considère "sans méthode" si la liste est vide ou contient "rien"
    df["has_no_method"] = df["methode_preparation_exam"].apply(
        lambda x: len(x) == 0 or any("rien" in str(m).lower() or "aucune" in str(m).lower() for m in x)
    )
    stats_dict["h2_pct_sans_methode"] = round(df["has_no_method"].mean() * 100, 1)

    df["mentions_manque_methode"] = df["difficulte_preparation"].fillna("").str.contains("méthode", case=False)
    stats_dict["h2_pct_manque_methode"] = round(df["mentions_manque_methode"].mean() * 100, 1)

    # 9. H3 : Taux d'adoption
    adoption_keywords = ["oui", "certainement", "probablement", "absolument", "régulièrement"]
    df["is_adopter"] = df["utiliserait_app"].fillna("").apply(
        lambda x: any(kw in str(x).lower() for kw in adoption_keywords)
    )
    stats_dict["h3_pct_adoption"] = round(df["is_adopter"].mean() * 100, 1)

    # 10. Suggestions libres
    stats_dict["suggestions"] = df["suggestions"].dropna().str.strip().replace("", np.nan).dropna().tolist()

    return stats_dict