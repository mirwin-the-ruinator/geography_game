import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartGame from './routes/StartGame';
import SignUp from './routes/SignUp';
import Login from './routes/Login';
import GamePage from './routes/GamePage';
import ResultPage from './routes/ResultPage';
import InviteFriend from './routes/InviteFriend';
import UserSummaryPage from './routes/UserSummaryPage';

const App = () => (
  <Router>
    <div className="w-full max-w-lg m-auto">
      <Routes>
        <Route path="/" element={<StartGame />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/play/:gameId" element={<GamePage />} />
        <Route path="/results/:gameId" element={<ResultPage />} />
        <Route path="/invite" element={<InviteFriend />} />
        <Route path="/user-summary" element={<UserSummaryPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
