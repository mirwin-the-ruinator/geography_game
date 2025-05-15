import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CompoundInput from '../components/CompoundInput';
import { NotificationType } from '../features/game/types';
import { useLoginMutation } from '../features/api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/identity/identitySlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') || '/';
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [notification] = useState<NotificationType>('email');
  const [contact, setContact] = useState('');

  const handleLogin = async () => {
    if (!username || !contact) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const user = await login({ username, contact, notification }).unwrap();
      dispatch(setUser(user));
      navigate(next);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <h1>Log In</h1>

      <CompoundInput
        type="text"
        label="Username"
        value={username}
        onChange={setUsername}
      />

      <CompoundInput
        type={notification === 'sms' ? 'tel' : 'email'}
        label={notification === 'sms' ? 'Phone Number' : 'Email'}
        value={contact}
        onChange={setContact}
      />

      <button onClick={handleLogin} disabled={isLoading}>
        Log In
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
              return errData.detail ?? 'Login failed.';
            }
            return 'Login failed.';
          })()}
        </p>
      )}

      <button onClick={() => navigate('/signup')}>
        Need an account? Sign up
      </button>
    </div>
  );
};

export default Login;
