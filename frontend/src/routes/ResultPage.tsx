import { useParams, useNavigate } from 'react-router-dom';
import { useGetGameQuery } from '../features/api/gameApi';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { skipToken } from '@reduxjs/toolkit/query';
import Headline from '../components/headline/Headline';
import Button from '../components/button/Button';

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
      <Headline>Game Summary</Headline>
      <div className="mt-4">
        <p>
          <strong>Mode</strong>: {game.mode}
        </p>
        {game.mode === 'multi' && opponentReady && (
          <>
            <p>Winner: {game.winner ? `🏆 ${game.winner}` : 'It was a tie!'}</p>
            <p>
              Final Score: {username} {userScore} – {opponentScore} {opponent}
            </p>
          </>
        )}
      </div>
      {[...game.rounds]
        .sort((a, b) => a.round_index - b.round_index)
        .map((round, index) => {
          const userGuess = round.guesses.find((g) => g.player === username);
          const oppGuess = round.guesses.find((g) => g.player === opponent);
          console.log('R O U N D', round);

          return (
            <div key={index} className="py-2 border-b-1 border-gray-400 mb-3">
              <h3 className="font-semibold">Round {index + 1})</h3>
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

      <Button onClick={() => navigate('/')}>Play Again</Button>
    </div>
  );
};

export default ResultPage;
