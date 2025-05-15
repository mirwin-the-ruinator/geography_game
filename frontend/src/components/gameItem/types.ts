type Props = {
  game: {
    gameId: string;
    mode: 'single' | 'multi';
    status: string;
    player1: string;
    player2?: string;
    winner?: string | null;
  };
  expanded: boolean;
  onToggle: () => void;
};

export default Props;
