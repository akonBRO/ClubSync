import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentRegister from './pages/StudentRegister';
import HomePage from './pages/HomePage';
import ClubRegister from './pages/ClubRegister';
import ClubLogin from './pages/ClubLogin';
import ClubDashboard from './pages/ClubDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-student" element={<StudentRegister />} />
        <Route path="/register-club" element={<ClubRegister />} />
        <Route path="/login-club" element={<ClubLogin />} />
        <Route path="/club-dashboard" element={<ClubDashboard />} />
         {/* <Route path="/club-dashboard/overview" element={<ClubOverview />} /> */}
        {/* <Route path="/club-dashboard/events" element={<ClubEvents />} /> */}
        {/* <Route path="/club-dashboard/members" element={<ClubMembers />} /> */}
        {/* <Route path="/club-dashboard/settings" element={<ClubSettings />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
