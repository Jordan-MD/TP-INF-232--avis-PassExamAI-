FROM python:3.11-slim

# Définir le dossier de travail
WORKDIR /code

# Copier le fichier des dépendances
COPY ./requirements.txt /code/requirements.txt

# Installer les dépendances
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copier le dossier backend complet
COPY ./backend /code/backend

# Lancer l'application FastAPI sur le port 7860 (port par défaut de Hugging Face Spaces)
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "7860"]
