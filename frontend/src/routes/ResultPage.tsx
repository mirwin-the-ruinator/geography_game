import { useParams, useNavigate } from 'react-router-dom';
import { useGetGameQuery } from '../features/api/gameApi';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';

const ResultPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const username = useSelector(
    (state: RootState) => state.identity.user?.username
  );
  const {
    data: game,
    isLoading,
    error,
  } = useGetGameQuery(gameId && username ? { gameId, username } : skipToken);

  useEffect(() => {
    if (game) {
      console.log('Game data:', game);
      console.log('Game Status:', game.status);
      console.log('Rounds:', game.rounds);
    }
  }, [game]);
  // Debugging: Log game data to console

  if (!gameId || !username) return <p>Missing game or user.</p>;
  if (isLoading) return <p>Loading results...</p>;
  if (error || !game) return <p>Could not load game results.</p>;

  const opponent = username === game.player1 ? game.player2 : game.player1;
  const opponentReady =
    game.mode === 'multi' &&
    game.player1 &&
    game.player2 &&
    game.rounds.every(
      (r) =>
        r.guesses.some((g) => g.player === game.player1) &&
        r.guesses.some((g) => g.player === game.player2)
    );

  const userScore = game.rounds.reduce((score, round) => {
    const guess = round.guesses.find((g) => g.player === username);
    return guess?.correct ? score + 1 : score;
  }, 0);

  const opponentScore = game.rounds.reduce((score, round) => {
    const guess = round.guesses.find((g) => g.player === opponent);
    return guess?.correct ? score + 1 : score;
  }, 0);

  return (
    <div>
      <h1>Game Summary</h1>
      <p>Mode: {game.mode}</p>
      {game.mode === 'multi' && opponentReady && (
        <>
          <p>Winner: {game.winner ? `🏆 ${game.winner}` : 'It was a tie!'}</p>
          <p>
            Final Score: {username} {userScore} – {opponentScore} {opponent}
          </p>
        </>
      )}

      {[...game.rounds]
        .sort((a, b) => a.round_index - b.round_index)
        .map((round, index) => {
          const userGuess = round.guesses.find((g) => g.player === username);
          const oppGuess = round.guesses.find((g) => g.player === opponent);
          console.log('R O U N D', round);

          return (
            <div
              key={index}
              style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}
            >
              <h3>Round {index + 1})</h3>
              <p>
                Your guess: <strong>{userGuess?.value ?? '—'}</strong>{' '}
                {userGuess?.correct ? '✅ Correct' : `❌ Incorrect`}
              </p>
              {opponent && oppGuess && (
                <p>
                  {opponent}'s guess: <strong>{oppGuess?.value ?? '—'}</strong>{' '}
                  {oppGuess?.correct ? '✅ Correct' : `❌ Incorrect`}
                </p>
              )}
              <p>
                Answer: <strong>{round.country}</strong>
              </p>
            </div>
          );
        })}

      <button onClick={() => navigate('/')}>Play Again</button>
    </div>
  );
};

export default ResultPage;
