import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import {
  useGetCountriesQuery,
  useGetGameQuery,
  useSubmitGuessMutation,
  useSendGameMutation,
  useGetHintMutation,
} from '../features/api/gameApi';
import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';

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
  } = useGetGameQuery(gameId && username ? { gameId, username } : skipToken, {
    skip: !gameId || !username,
  });

  const [submitGuess, { isLoading: isSubmitting }] = useSubmitGuessMutation();
  const [sendGame] = useSendGameMutation();
  const { data: countries = [], isLoading: loadingCountries } =
    useGetCountriesQuery();
  const [getHint] = useGetHintMutation();

  const [guess, setGuess] = useState('');
  const [, setGuesses] = useState<string[]>([]);
  const [alreadyGuessed, setAlreadyGuessed] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [clues, setClues] = useState<string[]>([]);
  const [isRequestingClue, setIsRequestingClue] = useState(false);

  useEffect(() => {
    setAlreadyGuessed(false);
    setClues([]);
    setGuess('');
  }, [game?.current_round]);

  if (!gameId || !username) return <p>Missing game or user.</p>;
  if (isLoading) return <p>Loading game...</p>;
  if (error || !game) return <p>Could not load game.</p>;

  const handleGetHint = async () => {
    if (!username) return;
    setIsRequestingClue(true);
    try {
      const response = await getHint({
        gameId,
        roundIndex: game.current_round,
        player: username,
      }).unwrap();

      setClues((prev) => [...prev, response.clue]);
      console.log('Clue received:', response.clue);
      refetch(); // to update clue count in game state
    } catch (err) {
      console.error('Hint failed:', err);
      alert('Could not fetch a clue.');
    } finally {
      setIsRequestingClue(false);
    }
  };

  const handleSubmit = async () => {
    if (!guess.trim()) return;

    setGuesses((prev) => [...prev, guess]);
    setClues([]); // Reset clues for the next round

    try {
      const result = await submitGuess({
        gameId,
        player: username,
        value: guess,
      }).unwrap();

      setGuess('');
      setAlreadyGuessed(true);

      setFeedback(
        result?.correct
          ? '✅ You were right!'
          : `❌ The correct answer was ${result?.correct_answer ?? 'unknown'}`
      );
    } catch (err) {
      console.error('Guess failed:', err);
    }
  };

  const handleSend = async () => {
    try {
      await sendGame({ gameId: game.gameId, sender: username }).unwrap();
    } catch (err) {
      console.error('Send failed:', err);
      alert('Failed to send the game to your opponent.');
    }
  };

  const handleFinish = async () => {
    const updatedGame = await refetch().unwrap();
    if (updatedGame?.status === 'complete') {
      navigate(`/results/${gameId}`);
    }
  };

  return (
    <div>
      <h1>Geography Game</h1>
      {game.current_round < game.rounds.length && (
        <p>
          Round {game.current_round + 1} of {game.rounds.length}
        </p>
      )}

      {game.country_svg && (
        <img
          src={`http://localhost:8000${game.country_svg}`}
          alt="Country outline"
          style={{ width: '300px', marginBottom: '1rem' }}
        />
      )}

      {feedback && <p>{feedback}</p>}

      {(game.cluesAvailable ?? 0) > 0 && !alreadyGuessed && (
        <button onClick={handleGetHint} disabled={isRequestingClue}>
          Get a Hint - ({game.cluesAvailable ?? 0} clues left)
        </button>
      )}

      {(game.cluesUsedThisRound ?? 0) > 0 && !alreadyGuessed && (
        <div>
          <strong>Clues:</strong>
          <ul>
            {clues.map((clue, index) => (
              <li key={`clueItem${index}`}>{clue}</li>
            ))}
          </ul>
        </div>
      )}

      {!alreadyGuessed && game.status !== 'complete' && (
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

      {game.status === 'complete' && (
        <button onClick={handleFinish}>View Results</button>
      )}

      {game.status === 'complete' &&
        game.mode === 'multi' &&
        !game.sent &&
        username === game.player1 && (
          <button onClick={handleSend}>Send to your opponent</button>
        )}
    </div>
  );
};

export default GamePage;
