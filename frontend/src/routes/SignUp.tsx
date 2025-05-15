import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import CompoundInput from '../components/CompoundInput';
import NotificationSelect from '../components/NotificationSelect';
import { NotificationType } from '../features/game/types';
import { setUser } from '../features/identity/identitySlice';
import { useSignupMutation } from '../features/api/authApi';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading, error }] = useSignupMutation();

  const [username, setUsername] = useState('');
  const [notification, setNotification] = useState<NotificationType>('email');
  const [contact, setContact] = useState('');

  const handleSubmit = async () => {
    if (!username || !contact) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const user = await signup({ username, contact, notification }).unwrap();
      dispatch(setUser(user));
      navigate('/');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div>
      <h1>Create an Account</h1>

      <CompoundInput
        type="text"
        label="Username"
        value={username}
        onChange={setUsername}
      />
      <NotificationSelect value={notification} onChange={setNotification} />
      <CompoundInput
        type={notification === 'sms' ? 'tel' : 'email'}
        label={notification === 'sms' ? 'Phone Number' : 'Email'}
        value={contact}
        onChange={setContact}
      />

      <button onClick={handleSubmit} disabled={isLoading}>
        Sign Up
      </button>

      {error && (
        <p style={{ color: 'red' }}>
          {(() => {
            if (
              typeof error === 'object' &&
              error !== null &&
              'data' in error
            ) {
              const errData = error.data as { detail?: string };
              return errData.detail ?? 'Signup failed.';
            }
            return 'Signup failed.';
          })()}
        </p>
      )}
    </div>
  );
};

export default SignUp;
