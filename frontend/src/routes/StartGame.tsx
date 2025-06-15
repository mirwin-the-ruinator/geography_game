import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { useStartGameMutation } from '../features/api/gameApi';
import { GameMode } from '../features/game/types';
import Button from '../components/button/Button';
import Headline from '../components/headline/Headline';
import SinglePlayerIcon from '../components/IconSinglePlayer';
import TwoPlayerIcon from '../components/IconTwoPlayer';

const StartGame = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.identity.user);
  const [mode, setMode] = useState<GameMode>('single');
  const [startGame, { isLoading, error }] = useStartGameMutation();
  const [player2Contact, setPlayer2Contact] = useState('');

  const handleStart = async () => {
    if (!user) return;

    const args = {
      mode,
      player1: user.username,
      player2: mode === 'multi' ? player2Contact : undefined,
    };

    try {
      const res = await startGame(args).unwrap();
      navigate(`/play/${res.gameId}`);
    } catch (err) {
      console.error('Error starting game:', err);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center">
        <h1>🌍 Geography Game</h1>
        <p>
          Please <a href="/login">log in</a> to start a game.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Headline>Welcome back, {user.username}!</Headline>

      <div className="p-4 flex items-center justify-center gap-4">
        <div
          className={`p-4 rounded text-center ${mode === 'single' ? 'bg-violet-400' : ''}`}
        >
          <button
            type="button"
            onClick={() => setMode('single')}
            className="cursor-pointer"
          >
            <SinglePlayerIcon />
            <span className="ml-2">Single Player</span>
          </button>
        </div>
        <div
          className={`p-4 text-center rounded ${mode === 'multi' ? 'bg-violet-400' : ''}`}
        >
          <button
            type="button"
            onClick={() => setMode('multi')}
            className=" cursor-pointer"
          >
            <TwoPlayerIcon />
            <span className="ml-2">Two Player</span>
          </button>
        </div>
      </div>

      <div className="mt-4 w-full text-center">
        {mode === 'multi' && (
          <div className="mb-4">
            <input
              id="player2Contact"
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-72 focus:border-violet-400 focus:outline-0"
              type="text"
              placeholder="Opponent's email or phone number"
              value={player2Contact}
              onChange={(e) => setPlayer2Contact(e.target.value)}
            />
          </div>
        )}
        <Button onClick={handleStart} disabled={isLoading}>
          Start Game
        </Button>
      </div>
      {user && (
        <div className="mt-8">
          <Link
            className="block px-8 py-4 rounded border-teal-300 border-1 hover:bg-sky-100"
            to="/user-summary"
          >
            📊 View My Results
          </Link>
        </div>
      )}

      {error && (
        <p style={{ color: 'red' }}>Could not start game. Try again.</p>
      )}
    </div>
  );
};

export default StartGame;
