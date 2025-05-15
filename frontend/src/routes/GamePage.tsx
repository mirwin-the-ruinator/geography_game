import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import {
  useGetCountriesQuery,
  useGetGameQuery,
  useSubmitGuessMutation,
  useSendGameMutation,
} from '../features/api/gameApi';
import { useState } from 'react';

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const username = useSelector(
    (state: RootState) => state.identity.user?.username
  );

  const {
    data: game,
    isLoading,
    error,
    refetch,
  } = useGetGameQuery(gameId ?? '');

  const [submitGuess, { isLoading: isSubmitting }] = useSubmitGuessMutation();
  const [sendGame] = useSendGameMutation();
  const { data: countries = [], isLoading: loadingCountries } =
    useGetCountriesQuery();

  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [alreadyGuessed, setAlreadyGuessed] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!gameId || !username) return <p>Missing game or user.</p>;
  if (isLoading) return <p>Loading game...</p>;
  if (error || !game) return <p>Could not load game.</p>;

  const currentRound =
    game.rounds && game.current_round < game.rounds.length
      ? game.rounds[game.current_round]
      : null;

  if (!currentRound) return <p>Waiting for the next round to load...</p>;

  const isComplete = game.status === 'complete';
  const isLastRound = game.current_round === game.maxGuesses - 1;

  const handleSubmit = async () => {
    if (!guess.trim()) return;

    setGuesses((prev) => [...prev, guess]);

    try {
      const result = await submitGuess({
        gameId,
        player: username,
        value: guess,
      }).unwrap();

      setGuess('');
      setAlreadyGuessed(true);

      // Wait for backend to persist guess and advance round
      const updatedGame = await refetch().unwrap();

      setFeedback(
        result?.correct
          ? '✅ You were right!'
          : `❌ The correct answer was ${result?.correct_answer ?? 'unknown'}`
      );
      setAlreadyGuessed(false);

      if (updatedGame.status === 'complete') {
        navigate(`/results/${gameId}`);
      }
    } catch (err) {
      console.error('Guess failed:', err);
    }
  };

  const handleSend = async () => {
    try {
      await sendGame({ gameId: game.gameId, sender: username }).unwrap();
      const updatedGame = await refetch().unwrap();

      if (updatedGame.status === 'complete') {
        navigate(`/results/${gameId}`);
      } else {
        setTimeout(() => navigate(`/results/${gameId}`), 500);
      }
    } catch (err) {
      console.error('Send failed:', err);
      alert('Failed to send the game to your opponent.');
    }
  };

  const handleNext = () => {
    setFeedback('');
    refetch();
  };

  if (isComplete) {
    navigate(`/results/${game.gameId}`);
    return null;
  }

  return (
    <div>
      <h1>Geography Game</h1>
      <p>
        Round {game.current_round + 1} of {game.rounds.length}
      </p>

      {game.country_svg && (
        <img
          src={`http://localhost:8000${game.country_svg}`}
          alt="Country outline"
          style={{ width: '300px', marginBottom: '1rem' }}
        />
      )}

      {feedback && <p>{feedback}</p>}

      {!alreadyGuessed && (
        <div>
          <label htmlFor="guess-select">Your guess:</label>
          <select
            id="guess-select"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={isSubmitting || loadingCountries}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <button onClick={handleSubmit} disabled={isSubmitting || !guess}>
            Submit Guess
          </button>
        </div>
      )}

      {alreadyGuessed && !isLastRound && (
        <button onClick={handleNext}>Next</button>
      )}

      {guesses.length === game.maxGuesses && (
        <button
          onClick={async () => {
            const updatedGame = await refetch().unwrap();
            if (updatedGame.status === 'complete') {
              navigate(`/results/${gameId}`);
            } else {
              setTimeout(() => navigate(`/results/${gameId}`), 500);
            }
          }}
        >
          View Results
        </button>
      )}

      {alreadyGuessed &&
        isLastRound &&
        game.mode === 'multi' &&
        !game.sent &&
        username === game.player1 && (
          <button onClick={handleSend}>Send to your opponent</button>
        )}
    </div>
  );
};

export default GamePage;
