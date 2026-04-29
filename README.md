# Enquête IA & PassExamAI — Documentation

## Structure du projet

```
survey-app/
├── backend/
│   ├── __init__.py
│   ├── database.py     # SQLite + SQLAlchemy setup
│   ├── models.py       # Modèle Response (ORM)
│   ├── schemas.py      # Validation Pydantic
│   ├── analysis.py     # Stats pandas — H1, H2, H3
│   └── main.py         # FastAPI app + routes
├── frontend/
│   ├── index.html      # Formulaire (23 questions, 4 sections)
│   └── dashboard.html  # Dashboard admin (Chart.js)
├── requirements.txt
└── README.md
```

## Installation

```bash
# 1. Cloner / se placer dans le dossier
cd survey-app

# 2. Créer un environnement virtuel (recommandé)
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# ou .venv\Scripts\activate      # Windows

# 3. Installer les dépendances
pip install -r requirements.txt
```

## Lancement

```bash
# Se placer dans le dossier backend
cd backend

# Lancer le serveur
uvicorn app.main:app --reload
```

- **Formulaire** → http://localhost:8000/
- **Dashboard** → http://localhost:8000/dashboard
- **Docs API** → http://localhost:8000/docs

## Accès admin

Le dashboard est protégé par un token. Token par défaut :

```
passexam-admin-2024
```

> ⚠️ Change ce token dans `backend/main.py` → variable `ADMIN_TOKEN` avant de déployer.

## API Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/` | Non | Formulaire |
| GET | `/dashboard` | Non | Dashboard (login requis) |
| POST | `/api/submit` | Non | Soumettre une réponse |
| GET | `/api/analysis` | Token | Stats complètes (JSON) |
| GET | `/api/responses` | Token | Toutes les réponses brutes |
| GET | `/api/health` | Non | Vérification serveur |

## Hypothèses testées

- **H1** — Corrélation entre usage IA et score de perception (Pearson)
- **H2** — % d'étudiants sans méthode structurée de préparation
- **H3** — Taux d'adoption de PassExamAI (test > 60%)

## Déploiement (Render)

1. Push sur GitHub
2. Créer un Web Service sur Render
3. Build command : `pip install -r requirements.txt`
4. Start command : `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Ajouter variable d'env `ADMIN_TOKEN` dans le dashboard Render
