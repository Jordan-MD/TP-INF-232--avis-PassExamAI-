from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class SurveySubmission(BaseModel):
    # Section 0
    niveau_etudes: str
    faculte: str
    filiere: str
    genre: str
    utilise_ia: str
    outils_ia: List[str] = []
    contextes_ia: List[str] = Field(default=[])

    # Section 1
    niveau_connaissance_ia: int = Field(ge=1, le=5)
    ia_opportunite: int = Field(ge=1, le=5)
    ia_menace_emploi: int = Field(ge=1, le=5)
    confiance_ia: int = Field(ge=1, le=5)
    dangers_ia: List[str] = []

    # Section 2
    frequence_ia_etudes: str
    usage_ia_etudes: List[str] = []
    methode_preparation_exam: List[str] = []
    difficulte_preparation: str
    ia_ameliore_reussite: int = Field(ge=1, le=5)
    freins_ia_etudes: List[str] = []

    # Section 3
    solution_repond_probleme: int = Field(ge=1, le=5)
    fonctionnalites_utiles: List[str] = []
    utiliserait_app: str
    format_prefere: str
    budget_mensuel: str
    suggestions: Optional[str] = ""

    @field_validator("contextes_ia")
    @classmethod
    def max_two_contextes(cls, v):
        if len(v) > 2:
            raise ValueError("Maximum 2 contextes autorisés")
        return v


class ResponseOut(BaseModel):
    id: int
    submitted_at: str
    niveau_etudes: str
    filiere: str
    genre: str
    utilise_ia: str

    model_config = {"from_attributes": True}
