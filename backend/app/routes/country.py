from fastapi import APIRouter
from typing import List
from app.constants import COUNTRIES

router = APIRouter()


@router.get("/countries", response_model=List[str])
def get_countries():
    return COUNTRIES
