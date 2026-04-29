FROM python:3.11-slim

# Installer uv dans le conteneur
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /code

# Copier les fichiers de configuration uv
COPY ./backend/pyproject.toml ./backend/uv.lock* /code/

# Installer les dépendances avec uv (crée un environnement optimisé)
RUN uv pip install --system --no-cache -r /code/pyproject.toml

# Copier le reste du code
COPY ./backend /code

# Lancer l'app
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "7860"]
