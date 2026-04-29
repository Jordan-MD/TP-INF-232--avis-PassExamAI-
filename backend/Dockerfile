FROM python:3.11-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /code

# Paths locaux maintenant que le Dockerfile est dans backend/
COPY pyproject.toml uv.lock* /code/

RUN uv pip install --system --no-cache -r /code/pyproject.toml

COPY . /code

CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "7860"]