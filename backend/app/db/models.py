from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import joinedload, relationship, Session
from uuid import uuid4
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True, index=True)
    contact = Column(String, nullable=False)
    notification = Column(String, nullable=False)

    games_as_player1 = relationship("Game", back_populates="player1_user", foreign_keys="Game.player1")
    games_as_player2 = relationship("Game", back_populates="player2_user", foreign_keys="Game.player2")


class Game(Base):
    __tablename__ = "games"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    mode = Column(String, nullable=False)  # 'single' or 'multi'
    player1 = Column(String, ForeignKey("users.username"))
    player2 = Column(String, ForeignKey("users.username"), nullable=True)
    current_round = Column(Integer, default=0)
    sent = Column(Boolean, default=False)
    status = Column(String, default="ongoing")
    winner = Column(String, nullable=True)

    player1_user = relationship("User", foreign_keys=[player1], back_populates="games_as_player1")
    player2_user = relationship("User", foreign_keys=[player2], back_populates="games_as_player2")
    rounds = relationship("GameRound", back_populates="game", cascade="all, delete-orphan")

    def calculate_winner(self):
        if not self.rounds or not self.player1 or not self.player2:
            self.winner = None
            return

        scores = {self.player1: 0, self.player2: 0}

        for round in self.rounds:
            for guess in round.guesses:
                if guess.player in scores and guess.correct:
                    scores[guess.player] += 1

        if scores[self.player1] > scores[self.player2]:
            self.winner = self.player1
        elif scores[self.player2] > scores[self.player1]:
            self.winner = self.player2
        else:
            self.winner = None  # It's a tie


class GameRound(Base):
    __tablename__ = "rounds"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id = Column(String, ForeignKey("games.id"))
    round_index = Column(Integer)
    country = Column(String)

    game = relationship("Game", back_populates="rounds")
    guesses = relationship("Guess", back_populates="round", cascade="all, delete-orphan")


class Guess(Base):
    __tablename__ = "guesses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    round_id = Column(Integer, ForeignKey("rounds.id"))
    player = Column(String)
    value = Column(String)
    correct = Column(Boolean)

    round = relationship("GameRound", back_populates="guesses")


# Optional helper to fix previously broken game completions
def backfill_completed_games(db: Session):
    print("🔧 Backfilling completed games...")
    games = db.query(Game).options(
        joinedload(Game.rounds).joinedload(GameRound.guesses)
    ).filter(Game.status == "ongoing").all()

    for game in games:
        if game.current_round >= len(game.rounds):
            print(f"→ Marking game {game.id} as complete")
            game.status = "complete"
            game.calculate_winner()

    db.commit()
    print("✅ Backfill complete.")
