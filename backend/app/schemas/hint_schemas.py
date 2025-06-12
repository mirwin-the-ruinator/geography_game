from pydantic import BaseModel

class HintRequest(BaseModel):
    gameId: str
    roundIndex: int
    player: str  # must be passed from frontend

class HintResponse(BaseModel):
    clue: str
