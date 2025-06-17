import { useState } from 'react';
import { Props } from './types';
import GameItem from '../../gameItem/GameItem';

const PastGames = ({ games }: Props) => {
  const [expandedGameIds, setExpandedGameIds] = useState<
    Record<string, boolean>
  >({});

  const toggleGameExpansion = (gameId: string) => {
    setExpandedGameIds((prev) => ({
      ...prev,
      [gameId]: !prev[gameId],
    }));
  };

  return (
    <div>
      <h2 className="text-xl underline">Past Games</h2>
      {games.length === 0 ? (
        <p>No past games found.</p>
      ) : (
        games.map((game) => (
          <GameItem
            key={game.gameId}
            game={game}
            expanded={expandedGameIds[game.gameId] || false}
            onToggle={() => toggleGameExpansion(game.gameId)}
          />
        ))
      )}
    </div>
  );
};

export default PastGames;
