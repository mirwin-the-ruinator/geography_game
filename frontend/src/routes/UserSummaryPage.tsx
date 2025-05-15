import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useGetUserSummaryQuery } from '../features/api/authApi';
import { useListUserGamesQuery } from '../features/api/gameApi';
import SummaryStats from '../components/summary/summaryStats/SummaryStats';
import RegionAccuracy from '../components/summary/regionAccuracy/RegionAccuracy';
import PastGames from '../components/summary/pastGames/PastGames';

const UserSummaryPage = () => {
  const username = useSelector(
    (state: RootState) => state.identity.user?.username
  );

  const {
    data: summary,
    error,
    isLoading,
  } = useGetUserSummaryQuery(username ?? '', {
    skip: !username,
  });

  const { data: games = [] } = useListUserGamesQuery(username ?? '', {
    skip: !username,
  });

  if (!username) return <p>You must be logged in to view your summary.</p>;
  if (isLoading) return <p>Loading your summary...</p>;
  if (error || !summary) return <p>Unable to load summary data.</p>;

  return (
    <div>
      <h1>{username}'s Summary</h1>

      <SummaryStats
        completedGames={summary.completedGames}
        accuracyRate={summary.accuracyRate}
        winRate={summary.winRate}
        longestStreak={summary.longestStreak}
      />

      <RegionAccuracy regionAccuracy={summary.regionAccuracy} />

      <PastGames games={games} />
    </div>
  );
};

export default UserSummaryPage;
