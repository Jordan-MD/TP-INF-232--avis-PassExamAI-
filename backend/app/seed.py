import httpx
import random

# ← change selon l'environnement
BASE_URL = "https://jordan001237-tp-inf-232.hf.space"

NIVEAUX = ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"]
FACULTES = ["FST", "FASSO", "FSEG", "FP", "FS"]
GENRES = ["Homme", "Femme"]
FREQUENCES = ["jamais", "rarement", "parfois", "souvent", "très souvent"]
OUTILS = ["ChatGPT", "Gemini", "Claude", "Copilot", "Perplexity"]
FORMATS = ["Quiz interactif", "Résumés PDF", "Vidéos courtes", "Flashcards"]
BUDGETS = ["0 FCFA", "500-1000 FCFA", "1000-3000 FCFA", "3000+ FCFA"]

def random_payload():
    return {
        "niveau_etudes": random.choice(NIVEAUX),
        "faculte": random.choice(FACULTES),
        "filiere": random.choice(["Informatique", "Mathématiques", "Physique", "Gestion"]),
        "genre": random.choice(GENRES),
        "utilise_ia": random.choice(["Oui", "Non", "Parfois"]),
        "outils_ia": random.sample(OUTILS, k=random.randint(1, 3)),
        "contextes_ia": random.sample(["Révisions", "Devoirs", "Recherche", "Rédaction"], k=2),
        "niveau_connaissance_ia": random.randint(1, 5),
        "ia_opportunite": random.randint(1, 5),
        "ia_menace_emploi": random.randint(1, 5),
        "confiance_ia": random.randint(1, 5),
        "dangers_ia": random.sample(["Désinformation", "Plagiat", "Dépendance", "Vie privée"], k=2),
        "frequence_ia_etudes": random.choice(FREQUENCES),
        "usage_ia_etudes": random.sample(["Résumés", "Exercices", "Explications", "Traduction"], k=2),
        "methode_preparation_exam": random.sample(["Fiches", "Annales", "Groupes d'étude", "rien"], k=2),
        "difficulte_preparation": random.choice(["Manque de méthode", "Pas assez de temps", "Cours incomplets"]),
        "ia_ameliore_reussite": random.randint(1, 5),
        "freins_ia_etudes": random.sample(["Connexion", "Langue", "Confiance", "Coût"], k=2),
        "solution_repond_probleme": random.randint(1, 5),
        "fonctionnalites_utiles": random.sample(["Quiz auto", "Résumés", "Planning", "Chatbot"], k=2),
        "utiliserait_app": random.choice(["Oui certainement", "Probablement", "Non"]),
        "format_prefere": random.choice(FORMATS),
        "budget_mensuel": random.choice(BUDGETS),
        "suggestions": random.choice(["Bonne initiative", "Très utile", "", "J'attends ça !"]),
    }

def seed(n: int = 30):
    with httpx.Client(timeout=30) as client:
        for i in range(n):
            r = client.post(f"{BASE_URL}/api/submit", json=random_payload())
            print(f"[{i+1}/{n}] status={r.status_code}")

if __name__ == "__main__":
    seed(30)  # insère 30 réponses fictives