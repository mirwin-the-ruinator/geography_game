from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import joinedload, Session
from app.db.database import SessionLocal
from app.db.models import Game, Guess
from app.schemas.user_schemas import UserSummaryResponse
from app.constants import COUNTRY_TO_REGION

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/user/{username}")
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(username=username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": user.username}

@router.get("/user-summary", response_model=UserSummaryResponse)
def user_summary(username: str = Query(...), db: Session = Depends(get_db)):
    games = db.query(Game).filter(
        (Game.player1 == username) | (Game.player2 == username),
        Game.status == "complete"
    ).all()

    if not games:
        raise HTTPException(status_code=404, detail="No completed games found")

    guesses = (
        db.query(Guess)
            .options(joinedload(Guess.round))
            .filter(Guess.player == username)
            .all()
    )
    correct = sum(1 for g in guesses if g.correct)
    total = len(guesses)

    wins = sum(1 for g in games if g.winner == username and g.mode == "multi")
    multi_games = sum(1 for g in games if g.mode == "multi")

    # Longest correct guess streak
    streak = 0
    max_streak = 0
    for g in sorted(guesses, key=lambda x: x.id):  # Assumes ID reflects order
        if g.correct:
            streak += 1
            max_streak = max(max_streak, streak)
        else:
            streak = 0

    # Region accuracy
    region_counts = {}
    region_correct = {}
    for g in guesses:
        region = COUNTRY_TO_REGION.get(g.round.country if g.round else None, "Unknown")
        region_counts[region] = region_counts.get(region, 0) + 1
        if g.correct:
            region_correct[region] = region_correct.get(region, 0) + 1

    region_accuracy = {
        region: region_correct.get(region, 0) / count
        for region, count in region_counts.items()
    }

    return UserSummaryResponse(
        username=username,
        completedGames=len(games),
        accuracyRate=correct / total if total > 0 else 0.0,
        winRate=wins / multi_games if multi_games > 0 else 0.0,
        longestStreak=max_streak,
        regionAccuracy=region_accuracy,
    )
