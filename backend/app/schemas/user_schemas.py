from pydantic import BaseModel
from typing import Dict

class UserSummaryResponse(BaseModel):
    username: str
    completedGames: int
    accuracyRate: float
    winRate: float
    longestStreak: int
    regionAccuracy: Dict[str, float]
