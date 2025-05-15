import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../features/game/gameSlice';
import identityReducer from '../features/identity/identitySlice';
import { api } from '../features/api/apiSlice';
import { authApi } from '../features/api/authApi';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    identity: identityReducer,
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
