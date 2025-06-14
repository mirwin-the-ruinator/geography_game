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
import Headline from '../components/headline/Headline';
import Button from '../components/button/Button';

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
    <div className="flex flex-col items-center">
      <Headline>🌍 Geography Game</Headline>

      {game.current_round < game.rounds.length && (
        <div className="my-4">
          {' '}
          <p>
            Round {game.current_round + 1} of {game.rounds.length}
          </p>
        </div>
      )}

      {game.country_svg && (
        <div className="my-2">
          <img
            src={`http://localhost:8000${game.country_svg}`}
            alt="Country outline"
            style={{ width: '300px', marginBottom: '1rem' }}
          />
        </div>
      )}

      {feedback && <p>{feedback}</p>}

      {(game.cluesAvailable ?? 0) > 0 && !alreadyGuessed && (
        <div className="my-4">
          <Button
            variant="secondary"
            onClick={handleGetHint}
            disabled={isRequestingClue}
          >
            Get a Hint - ({game.cluesAvailable ?? 0} clues left)
          </Button>
        </div>
      )}

      {(game.cluesUsedThisRound ?? 0) > 0 && !alreadyGuessed && (
        <div className="bg-orange-300 rounded px-3 py-2">
          <strong>Clues:</strong>
          <ul className="list-none">
            {clues.map((clue, index) => (
              <li
                className="mb-2 pb-1 border-b-1 border-b-amber-800"
                key={`clueItem${index}`}
              >
                {clue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!alreadyGuessed && game.status !== 'complete' && (
        <div>
          <div className="my-4 rounded bg-amber-950 p-4 text-white">
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
          </div>
          <div className="my-4 flex justify-center">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !guess}
            >
              Submit Guess
            </Button>
          </div>
        </div>
      )}

      {game.status === 'complete' && (
        <div className="my-4">
          <Button variant="primary" onClick={handleFinish}>
            View Results
          </Button>
        </div>
      )}

      {game.status === 'complete' &&
        game.mode === 'multi' &&
        !game.sent &&
        username === game.player1 && (
          <div className="my-4">
            <Button
              variant="secondary"
              onClick={handleSend}
              disabled={isSubmitting}
            >
              Send to your opponent
            </Button>
          </div>
        )}
    </div>
  );
};

export default GamePage;
