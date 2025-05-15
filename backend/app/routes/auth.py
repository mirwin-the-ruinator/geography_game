from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import crud
from app.schemas.auth_schemas import SignupRequest, LoginRequest
from app.db.models import User  # SQLAlchemy model

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=SignupRequest)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    success = crud.create_user(db, payload.username, payload.contact, payload.notification)
    if not success:
        raise HTTPException(status_code=409, detail="User already exists")
    return payload

@router.post("/login", response_model=SignupRequest)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_credentials(db, payload.username, payload.contact, payload.notification)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return payload
