import Props from './types';

const SummaryStats = ({
  completedGames,
  accuracyRate,
  winRate,
  longestStreak,
}: Props) => (
  <div>
    <h2>Summary Stats</h2>
    <ul>
      <li>
        <strong>Games Completed:</strong> {completedGames}
      </li>
      <li>
        <strong>Accuracy Rate:</strong> {(accuracyRate * 100).toFixed(1)}%
      </li>
      <li>
        <strong>Win Rate (Multiplayer):</strong> {(winRate * 100).toFixed(1)}%
      </li>
      <li>
        <strong>Longest Correct Streak:</strong> {longestStreak}
      </li>
    </ul>
  </div>
);

export default SummaryStats;
