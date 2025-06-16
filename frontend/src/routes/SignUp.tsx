import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import CompoundInput from '../components/CompoundInput';
import NotificationSelect from '../components/NotificationSelect';
import { NotificationType } from '../features/game/types';
import { setUser } from '../features/identity/identitySlice';
import { useSignupMutation } from '../features/api/authApi';
import Headline from '../components/headline/Headline';
import Button from '../components/button/Button';

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
    <div className="border p-4 rounded shadow-md max-w-md mt-8">
      <Headline>Create an Account</Headline>

      <div className="mt-4">
        <CompoundInput
          type="text"
          label="Username"
          value={username}
          onChange={setUsername}
        />
      </div>

      <div className="mt-4">
        <NotificationSelect value={notification} onChange={setNotification} />
      </div>

      <div className="mt-4">
        <CompoundInput
          type={notification === 'sms' ? 'tel' : 'email'}
          label={notification === 'sms' ? 'Phone Number' : 'Email'}
          value={contact}
          onChange={setContact}
        />
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
          Sign Up
        </Button>
      </div>

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
