import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { useStartGameMutation } from '../features/api/gameApi';
import { GameMode } from '../features/game/types';

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
      <div>
        <h1>🌍 Geography Game</h1>
        <p>
          Please <a href="/login">log in</a> to start a game.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome back, {user.username}!</h1>

      <label>
        <input
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

      <button onClick={handleStart} disabled={isLoading}>
        Start Game
      </button>

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
