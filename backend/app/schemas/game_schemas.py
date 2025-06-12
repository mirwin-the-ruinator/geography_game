from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class StartGameRequest(BaseModel):
    mode: Literal["single", "multi"]
    player1: str
    player2: Optional[str] = None

class GameResponse(BaseModel):
    gameId: str
    mode: str
    player1: str
    player2: Optional[str] = None
    status: str

class GameSummary(BaseModel):
    gameId: str
    mode: str
    status: str
    player1: str
    player2: Optional[str]
    winner: Optional[str]

class SendGameRequest(BaseModel):
    gameId: str
    sender: str
