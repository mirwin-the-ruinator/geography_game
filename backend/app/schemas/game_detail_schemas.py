from pydantic import BaseModel
from typing import List, Optional

class GuessSchema(BaseModel):
    player: str
    value: str
    correct: bool

class GameRoundSchema(BaseModel):
    country: Optional[str]  # Only shown after completion
    guesses: List[GuessSchema]
    round_index: int

class GameDetailResponse(BaseModel):
    gameId: str
    mode: str
    player1: str
    player2: Optional[str]
    status: str
    winner: Optional[str]
    current_round: int
    country_svg: Optional[str]
    rounds: List[GameRoundSchema]
    cluesAvailable: Optional[int] = None
    cluesUsedThisRound: Optional[int] = None
