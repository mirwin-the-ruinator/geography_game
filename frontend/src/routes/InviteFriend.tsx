import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompoundInput from '../components/CompoundInput';
import { RootState } from '../app/store';
import { setOpponentContact } from '../features/game/gameSlice';

const InviteFriend = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentPlayer = useSelector((state: RootState) => state.game.currentPlayer);
  const gameMode = useSelector((state: RootState) => state.game.gameMode);
  const [friendName, setFriendName] = useState('');
  const [friendContact, setFriendContact] = useState('');

  const notificationType = currentPlayer?.notification ?? 'email';

  const handleInvite = () => {
    dispatch(setOpponentContact(friendContact));

    // Simulate starting a game; later this will POST to backend
    navigate('/play/placeholder-game-id');
  };

  if (!currentPlayer) {
    return <p>Missing player info. Please restart from the beginning.</p>;
  }

  return (
    <div>
      <h1>Invite a Friend</h1>

      <p>Hi {currentPlayer.username}! You're playing in <strong>{gameMode}</strong> mode.</p>

      <CompoundInput
        type="text"
        label="Friend’s Name"
        value={friendName}
        onChange={setFriendName}
      />

      <CompoundInput
        type={notificationType === 'sms' ? 'tel' : 'email'}
        label={notificationType === 'sms' ? 'Phone Number' : 'Email'}
        value={friendContact}
        onChange={setFriendContact}
      />

      <button onClick={handleInvite}>Send Invite</button>
    </div>
  );
};

export default InviteFriend;
