# Enquête IA & PassExamAI — Documentation

## Structure du projet

```
survey-app/
├── backend/
│   ├── app/
│   │   ├── database.py     # SQLite + SQLAlchemy setup
│   │   ├── models.py       # Modèle Response (ORM)
│   │   ├── schemas.py      # Validation Pydantic
│   │   ├── analysis.py     # Stats pandas — H1, H2, H3
│   │   └── main.py         # FastAPI app + routes
│   ├── pyproject.toml      # Dépendances (uv)
│   └── uv.lock             # Lockfile (uv)
├── frontend/
│   ├── index.html          # Formulaire (23 questions, 4 sections)
│   └── dashboard.html      # Dashboard admin (Chart.js)
└── README.md
```

## Installation

```bash
# 1. Cloner / se placer dans le dossier
cd survey-app/backend

# 2. Installer uv (si pas déjà fait)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 3. Installer les dépendances et créer le venv
uv sync
```

## Lancement

```bash
# Se placer dans le dossier backend
cd backend

# Lancer le serveur avec uv
uv run uvicorn app.main:app --reload
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

| Méthode | Route            | Auth  | Description                |
| ------- | ---------------- | ----- | -------------------------- |
| GET     | `/`              | Non   | Formulaire                 |
| GET     | `/dashboard`     | Non   | Dashboard (login requis)   |
| POST    | `/api/submit`    | Non   | Soumettre une réponse      |
| GET     | `/api/analysis`  | Token | Stats complètes (JSON)     |
| GET     | `/api/responses` | Token | Toutes les réponses brutes |
| GET     | `/api/health`    | Non   | Vérification serveur       |

## Hypothèses testées

- **H1** — Corrélation entre usage IA et score de perception (Pearson)
- **H2** — % d'étudiants sans méthode structurée de préparation
- **H3** — Taux d'adoption de PassExamAI (test > 60%)

## Déploiement

### Backend (Hugging Face Spaces)

Le backend est déployé dans un container Docker sur Hugging Face.

1. Le projet utilise un `Dockerfile` qui installe `uv` pour une gestion optimale des dépendances.
2. Déploiement automatique via GitHub Actions (voir `.github/workflows/deploy.yml`).
3. Variables d'environnement nécessaires : `ADMIN_TOKEN`.

### Frontend (Vercel)

Le frontend est hébergé sur Vercel pour une performance maximale.

1. Connecter le repo GitHub à Vercel.
2. Configurer le répertoire racine sur `frontend/`.
3. S'assurer que les appels API pointent vers l'URL Hugging Face.
