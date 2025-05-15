export interface StartGameRequest {
  mode: 'single' | 'multi';
  player1: string;
  player2?: string;
}

export interface GameResponse {
  gameId: string;
  maxGuesses: number;
  mode: 'single' | 'multi';
  player1: string;
  player2?: string;
  status: 'ongoing' | 'complete';
}

export interface Guess {
  player: string;
  value: string;
  correct: boolean;
}

export interface GameRound {
  country: string | null;
  guesses: Guess[];
}

export interface GameDetailResponse {
  gameId: string;
  maxGuesses: number;
  mode: 'single' | 'multi';
  player1: string;
  player2?: string;
  status: 'ongoing' | 'complete';
  guesses: Guess[];
  winner?: string;
  country_svg?: string;
  sent: boolean;
  rounds: GameRound[];
  current_round: number;
}

export interface SubmitGuessRequest {
  gameId: string;
  player: string;
  value: string;
}

export interface SubmitGuessResponse {
  correct: boolean;
  status: 'ongoing' | 'complete';
  guesses: Guess[];
  winner?: string;
  correct_answer: string;
}

export interface GameSummary {
  gameId: string;
  maxGuesses: number;
  mode: 'single' | 'multi';
  status: 'ongoing' | 'complete';
  player1: string;
  player2?: string;
  winner?: string | null;
}
