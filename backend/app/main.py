import os
import json
import logging
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import engine, get_db, Base
from app.models import Response
from app.schemas import SurveySubmission
from app.analysis import compute_stats

# ── Init ─────────────────────────────────────────────────────────
logger = logging.getLogger("__name__")
@app.on_event("startup")
def startup_event():
    logger.info("Ensuring DB schemas exists...")
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Survey API — IA & PassExamAI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static frontend ───────────────────────────────────────────────
FRONTEND = Path(__file__).parent.parent.parent / "frontend"
app.mount("/static", StaticFiles(directory=str(FRONTEND / "static")), name="static")

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")
if not ADMIN_TOKEN:
    raise HTTPException(status_code=500, detail="ADMIN_TOKEN est manquant dans .env")

def verify_admin(x_admin_token: str = Header(...)):
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Token invalide")


# ── Routes ────────────────────────────────────────────────────────

@app.get("/", include_in_schema=False)
def serve_form():
    return FileResponse(str(FRONTEND / "index.html"))


@app.get("/dashboard", include_in_schema=False)
def serve_dashboard():
    return FileResponse(str(FRONTEND / "dashboard.html"))


@app.post("/api/submit", status_code=201)
def submit_response(data: SurveySubmission, db: Session = Depends(get_db)):
    row = Response(
        niveau_etudes=data.niveau_etudes,
        faculte=data.faculte,
        filiere=data.filiere,
        genre=data.genre,
        utilise_ia=data.utilise_ia,
        outils_ia=json.dumps(data.outils_ia, ensure_ascii=False),
        contextes_ia=json.dumps(data.contextes_ia, ensure_ascii=False),
        niveau_connaissance_ia=data.niveau_connaissance_ia,
        ia_opportunite=data.ia_opportunite,
        ia_menace_emploi=data.ia_menace_emploi,
        confiance_ia=data.confiance_ia,
        dangers_ia=json.dumps(data.dangers_ia, ensure_ascii=False),
        frequence_ia_etudes=data.frequence_ia_etudes,
        usage_ia_etudes=json.dumps(data.usage_ia_etudes, ensure_ascii=False),
        methode_preparation_exam=json.dumps(data.methode_preparation_exam, ensure_ascii=False),
        difficulte_preparation=data.difficulte_preparation,
        ia_ameliore_reussite=data.ia_ameliore_reussite,
        freins_ia_etudes=json.dumps(data.freins_ia_etudes, ensure_ascii=False),
        solution_repond_probleme=data.solution_repond_probleme,
        fonctionnalites_utiles=json.dumps(data.fonctionnalites_utiles, ensure_ascii=False),
        utiliserait_app=data.utiliserait_app,
        format_prefere=data.format_prefere,
        budget_mensuel=data.budget_mensuel,
        suggestions=data.suggestions or "",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"success": True, "id": row.id}


# ── Endpoint PUBLIC — résultats agrégés (pas de données personnelles) ──
@app.get("/api/stats")
def get_public_stats(db: Session = Depends(get_db)):
    return compute_stats(db)


@app.get("/api/analysis")
def get_analysis(db: Session = Depends(get_db), _=Depends(verify_admin)):
    return compute_stats(db)


@app.get("/api/responses")
def get_responses(db: Session = Depends(get_db), _=Depends(verify_admin)):
    rows = db.query(Response).order_by(Response.submitted_at.desc()).all()
    return [r.to_dict() for r in rows]


@app.get("/api/health")
def health():
    return {"status": "ok"}
