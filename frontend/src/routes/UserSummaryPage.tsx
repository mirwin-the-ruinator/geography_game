import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useGetUserSummaryQuery } from '../features/api/authApi';
import { useListUserGamesQuery } from '../features/api/gameApi';
import SummaryStats from '../components/summary/summaryStats/SummaryStats';
import RegionAccuracy from '../components/summary/regionAccuracy/RegionAccuracy';
import PastGames from '../components/summary/pastGames/PastGames';
import Headline from '../components/headline/Headline';

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
      <Headline>{username}'s Summary</Headline>

      <div className="mt-4 bg-pink-100 p-4 rounded shadow-md">
        <SummaryStats
          completedGames={summary.completedGames}
          accuracyRate={summary.accuracyRate}
          winRate={summary.winRate}
          longestStreak={summary.longestStreak}
        />
      </div>

      <div className="mt-4 bg-fuchsia-100 p-4 rounded shadow-md">
        <RegionAccuracy regionAccuracy={summary.regionAccuracy} />
      </div>

      <div className="mt-4 bg-indigo-100 p-4 rounded shadow-md">
        <PastGames games={games} />
      </div>
    </div>
  );
};

export default UserSummaryPage;
