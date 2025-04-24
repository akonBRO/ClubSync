import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentRegister from './pages/StudentRegister';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-student" element={<StudentRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
