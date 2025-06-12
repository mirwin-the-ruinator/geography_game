from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db import models
from uuid import uuid4

# --- User CRUD ---

def create_user(db: Session, username: str, contact: str, notification: str) -> bool:
    user = models.User(username=username, contact=contact, notification=notification)
    try:
        db.add(user)
        db.commit()
        return True
    except IntegrityError:
        db.rollback()
        return False

def get_user_by_credentials(db: Session, username: str, contact: str, notification: str):
    return db.query(models.User).filter_by(username=username, contact=contact, notification=notification).first()

# --- Game CRUD ---

def create_game(db: Session, mode: str, player1: str, player2: str | None, countries: list[str]) -> models.Game:

    clues_available = {player1: 3}
    if mode == "multi" and player2:
        clues_available[player2] = 3

    game = models.Game(
        id=str(uuid4()),
        mode=mode,
        player1=player1,
        player2=player2,
        current_round=0,
        sent=False,
        status="ongoing",
        clues_available=clues_available,
        clues_used={}
    )
    db.add(game)
    db.flush()

    for index, country in enumerate(countries):
        round = models.GameRound(game_id=game.id, round_index=index, country=country)
        db.add(round)

    db.commit()
    db.refresh(game)
    return game

def get_game_by_id(db: Session, game_id: str) -> models.Game | None:
    return db.query(models.Game).filter_by(id=game_id).first()

# --- Guessing ---

def record_guess(db: Session, round_id: int, player: str, value: str, correct: bool):
    guess = models.Guess(round_id=round_id, player=player, value=value, correct=correct)
    db.add(guess)
    db.commit()
    db.refresh(guess)
    return guess
