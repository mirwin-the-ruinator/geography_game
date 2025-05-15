type Game = {
  gameId: string;
  mode: 'single' | 'multi';
  status: string;
  player1: string;
  player2?: string;
  winner?: string | null;
};

type Props = {
  games: Game[];
};

export type { Game, Props };
