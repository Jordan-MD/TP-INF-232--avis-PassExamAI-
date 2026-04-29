import json
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, index
from app.database import Base


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Section 0 — Profil
    niveau_etudes = Column(String(50))
    faculte = Column(String(100))
    filiere = Column(String(100))
    genre = Column(String(20))
    utilise_ia = Column(String(5))        # "oui" / "non"
    outils_ia = Column(Text)             # JSON list
    contextes_ia = Column(Text)          # JSON list (max 2)

    # Section 1 — Perception IA
    niveau_connaissance_ia = Column(Integer)  # Likert 1-5
    ia_opportunite = Column(Integer)          # Likert 1-5
    ia_menace_emploi = Column(Integer)        # Likert 1-5
    confiance_ia = Column(Integer)            # Likert 1-5
    dangers_ia = Column(Text)                 # JSON list

    # Section 2 — IA & Éducation
    frequence_ia_etudes = Column(String(50))
    usage_ia_etudes = Column(Text)            # JSON list
    methode_preparation_exam = Column(Text)   # JSON list
    difficulte_preparation = Column(String(100))
    ia_ameliore_reussite = Column(Integer)    # Likert 1-5
    freins_ia_etudes = Column(Text)           # JSON list

    # Section 3 — Validation PassExamAI
    solution_repond_probleme = Column(Integer)  # Likert 1-5
    fonctionnalites_utiles = Column(Text)       # JSON list
    utiliserait_app = Column(String(50))
    format_prefere = Column(String(50))
    budget_mensuel = Column(String(100))
    suggestions = Column(Text)

    def to_dict(self):
        def parse(val):
            try:
                return json.loads(val) if val else []
            except Exception:
                return val

        return {
            "id": self.id,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "niveau_etudes": self.niveau_etudes,
            "faculte": self.faculte,
            "filiere": self.filiere,
            "genre": self.genre,
            "utilise_ia": self.utilise_ia,
            "outils_ia": parse(self.outils_ia),
            "contextes_ia": parse(self.contextes_ia),
            "niveau_connaissance_ia": self.niveau_connaissance_ia,
            "ia_opportunite": self.ia_opportunite,
            "ia_menace_emploi": self.ia_menace_emploi,
            "confiance_ia": self.confiance_ia,
            "dangers_ia": parse(self.dangers_ia),
            "frequence_ia_etudes": self.frequence_ia_etudes,
            "usage_ia_etudes": parse(self.usage_ia_etudes),
            "methode_preparation_exam": parse(self.methode_preparation_exam),
            "difficulte_preparation": self.difficulte_preparation,
            "ia_ameliore_reussite": self.ia_ameliore_reussite,
            "freins_ia_etudes": parse(self.freins_ia_etudes),
            "solution_repond_probleme": self.solution_repond_probleme,
            "fonctionnalites_utiles": parse(self.fonctionnalites_utiles),
            "utiliserait_app": self.utiliserait_app,
            "format_prefere": self.format_prefere,
            "budget_mensuel": self.budget_mensuel,
            "suggestions": self.suggestions,
        }
