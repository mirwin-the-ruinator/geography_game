import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameMode, Player } from './types';

interface GameState {
  currentPlayer: Player | null;
  gameMode: GameMode;
  opponentContact: string | null;
}

const initialState: GameState = {
  currentPlayer: null,
  gameMode: 'single',
  opponentContact: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentPlayer: (state, action: PayloadAction<Player>) => {
      state.currentPlayer = action.payload;
    },
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.gameMode = action.payload;
    },
    setOpponentContact: (state, action: PayloadAction<string>) => {
      state.opponentContact = action.payload;
    },
    resetGameState: () => initialState,
  },
});

export const {
  setCurrentPlayer,
  setGameMode,
  setOpponentContact,
  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer;
