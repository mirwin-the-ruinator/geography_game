import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Identity {
  username: string;
  contact: string;
  notification: 'email' | 'sms';
}

interface IdentityState {
  user: Identity | null;
}

const savedUser = localStorage.getItem('user');
const initialState: IdentityState = {
  user: savedUser ? JSON.parse(savedUser) : null,
};

export const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Identity>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, logout } = identitySlice.actions;
export default identitySlice.reducer;
