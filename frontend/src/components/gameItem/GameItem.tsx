import { Link } from 'react-router-dom';
import Props from './types';

const GameItem = ({ game, expanded, onToggle }: Props) => (
  <div
    style={{
      border: '1px solid #ccc',
      margin: '1rem 0',
      padding: '1rem',
    }}
  >
    <p>
      <strong>{game.mode.toUpperCase()}</strong> — Status:{' '}
      <strong>{game.status}</strong>{' '}
      {game.winner && (
        <>
          — Winner: <strong>{game.winner}</strong>
        </>
      )}
    </p>
    <button onClick={onToggle}>
      {expanded ? 'Hide Details' : 'View Details'}
    </button>
    {expanded && (
      <div style={{ marginTop: '0.5rem' }}>
        <p>
          Players: {game.player1}
          {game.player2 && ` vs ${game.player2}`}
        </p>
        <Link to={`/results/${game.gameId}`}>➡️ View Game Summary</Link>
      </div>
    )}
  </div>
);

export default GameItem;
