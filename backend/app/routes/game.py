from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from random import sample
from typing import List

from app.db.database import SessionLocal
from app.db import crud, models
from app.constants import COUNTRIES, ROUND_COUNT, COUNTRY_SVG_MAP
from app.schemas.game_schemas import StartGameRequest, GameResponse, GameSummary, SendGameRequest
from app.schemas.game_detail_schemas import GameDetailResponse, GameRoundSchema, GuessSchema
from app.schemas.guess_schemas import SubmitGuessRequest, SubmitGuessResponse, GuessResult

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/start", response_model=GameResponse)
def start_game(payload: StartGameRequest, db: Session = Depends(get_db)):
    if payload.mode not in ["single", "multi"]:
        raise HTTPException(status_code=400, detail="Invalid game mode")

    selected_countries = sample(COUNTRIES, ROUND_COUNT)

    game = crud.create_game(
        db=db,
        mode=payload.mode,
        player1=payload.player1,
        player2=payload.player2,
        countries=selected_countries,
    )

    return GameResponse(
        gameId=game.id,
        mode=game.mode,
        player1=game.player1,
        player2=game.player2,
        status=game.status,
        maxGuesses=ROUND_COUNT,
    )

@router.get("/game/{game_id}", response_model=GameDetailResponse)
def get_game_by_id(game_id: str, db: Session = Depends(get_db)):
    game = (
        db.query(models.Game)
        .options(
            joinedload(models.Game.rounds.and_(True)).joinedload(models.GameRound.guesses)
        )
        .filter(models.Game.id == game_id)
        .first()
    )

    # sort rounds explicitly in memory
    game.rounds.sort(key=lambda r: r.round_index)

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    show_country = game.status == "complete"

    rounds = []
    for r in sorted(game.rounds, key=lambda r: r.round_index):
        guesses = [
            GuessSchema(player=g.player, value=g.value, correct=g.correct)
            for g in sorted(r.guesses, key=lambda g: g.id)
        ]
        rounds.append(GameRoundSchema(
            round_index=r.round_index,
            country=r.country if show_country else None,
            guesses=guesses
        ))

    current_country = (
        game.rounds[game.current_round].country
        if game.rounds and game.current_round < len(game.rounds)
        else None
    )
    svg_filename = COUNTRY_SVG_MAP.get(current_country) if current_country else None
    svg_url = f"/static/svg/{svg_filename}" if svg_filename else None

    return GameDetailResponse(
        gameId=game.id,
        mode=game.mode,
        player1=game.player1,
        player2=game.player2,
        status=game.status,
        winner=game.winner,
        current_round=game.current_round,
        country_svg=svg_url,
        rounds=rounds,
        maxGuesses=ROUND_COUNT,
    )

@router.post("/guess", response_model=SubmitGuessResponse)
def submit_guess(payload: SubmitGuessRequest, db: Session = Depends(get_db)):
    game = (
        db.query(crud.models.Game)
        .options(joinedload(crud.models.Game.rounds).joinedload(crud.models.GameRound.guesses))
        .filter(crud.models.Game.id == payload.gameId)
        .first()
    )
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    if game.status == "complete":
        return SubmitGuessResponse(
            correct=False,
            correct_answer=None,
            status=game.status,
            guesses=[],
            winner=game.winner,
        )

    if game.current_round >= len(game.rounds):
        raise HTTPException(status_code=400, detail="No more rounds available")

    sorted_rounds = sorted(game.rounds, key=lambda r: r.round_index)
    current_round = sorted_rounds[game.current_round]

    if any(g.player == payload.player for g in current_round.guesses):
        raise HTTPException(status_code=400, detail="Player has already guessed this round")

    is_correct = payload.value.strip().lower() == current_round.country.lower()

    crud.record_guess(db, current_round.id, payload.player, payload.value, is_correct)

    db.refresh(game)

    if game.mode == "single":
        game.current_round += 1
    elif game.mode == "multi":
        both_guessed = all(
            any(g.player == p for g in current_round.guesses)
            for p in [game.player1, game.player2] if p
        )
        if both_guessed:
            game.current_round += 1

    if game.current_round >= len(game.rounds):
        game.status = "complete"
        game.calculate_winner()

    db.commit()
    db.refresh(game)

    response_guesses = [
        GuessResult(player=g.player, value=g.value, correct=g.correct)
        for g in current_round.guesses
    ]

    return SubmitGuessResponse(
        correct=is_correct,
        correct_answer=current_round.country,
        status=game.status,
        guesses=response_guesses,
        winner=game.winner,
    )

@router.get("/games", response_model=List[GameSummary])
def list_games(player: str = Query(...), db: Session = Depends(get_db)):
    games = (
        db.query(crud.models.Game)
        .filter((crud.models.Game.player1 == player) | (crud.models.Game.player2 == player))
        .all()
    )

    return [
        GameSummary(
            gameId=game.id,
            mode=game.mode,
            status=game.status,
            player1=game.player1,
            player2=game.player2,
            winner=game.winner,
            maxGuesses=ROUND_COUNT,
        )
        for game in games
    ]

@router.post("/send")
def send_game(payload: SendGameRequest, db: Session = Depends(get_db)):
    game = crud.get_game_by_id(db, payload.gameId)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    if game.mode != "multi":
        raise HTTPException(status_code=400, detail="Send only applies to multiplayer games")

    if payload.sender != game.player1:
        raise HTTPException(status_code=403, detail="Only player1 can send the game")

    if game.sent:
        raise HTTPException(status_code=400, detail="Game already sent")

    game.sent = True
    db.commit()

    return {"message": "Game sent to player 2."}
