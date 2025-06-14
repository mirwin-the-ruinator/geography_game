import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { useStartGameMutation } from '../features/api/gameApi';
import { GameMode } from '../features/game/types';
import Button from '../components/button/Button';
import Headline from '../components/headline/Headline';

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

      <div className="p-4">
        <label>
          <input
            className="text-blue-500"
            type="radio"
            name="mode"
            value="single"
            checked={mode === 'single'}
            onChange={() => setMode('single')}
          />
          Single Player
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="multi"
            checked={mode === 'multi'}
            onChange={() => setMode('multi')}
          />
          Two Player
        </label>
      </div>

      <div className="w-full flex justify-center">
        <Button onClick={handleStart} disabled={isLoading}>
          Start Game
        </Button>

        {mode === 'multi' && (
          <div>
            <input
              type="text"
              placeholder="Enter opponent's email or phone number"
              value={player2Contact}
              onChange={(e) => setPlayer2Contact(e.target.value)}
            />
          </div>
        )}
      </div>
      {user && (
        <div style={{ marginTop: '1rem' }}>
          <Link to="/user-summary">📊 View My Results</Link>
        </div>
      )}

      {error && (
        <p style={{ color: 'red' }}>Could not start game. Try again.</p>
      )}
    </div>
  );
};

export default StartGame;
