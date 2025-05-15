from pydantic import BaseModel
from typing import List, Optional

class SubmitGuessRequest(BaseModel):
    gameId: str
    player: str
    value: str

class GuessResult(BaseModel):
    player: str
    value: str
    correct: bool

class SubmitGuessResponse(BaseModel):
    correct: bool
    correct_answer: Optional[str]
    status: str
    guesses: List[GuessResult]
    winner: Optional[str]
