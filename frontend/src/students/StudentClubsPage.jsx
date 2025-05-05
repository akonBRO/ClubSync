import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentClubsPage.css';

const StudentClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/clubs/all')
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  const handleClose = () => setSelectedClub(null);

  return (
    <div className="club-page-container">
      <h1 className="club-page-title">All University Clubs</h1>

      <div className="club-buttons">
        <button onClick={() => navigate('/student/myclubs')}>My Clubs</button>
        <button onClick={() => navigate('/student/joinclubs')}>Join Clubs</button>
      </div>

      <div className="club-grid">
        {clubs.map((club) => (
          <div key={club._id} className="club-card">
            <img
              src={club.clogo || 'https://via.placeholder.com/100'}
              alt="Logo"
              className="club-logo"
            />
            <h2>{club.cname}</h2>
            <p><strong>Advisor:</strong> {club.caname}</p>
            <p><strong>President:</strong> {club.cpname}</p>
            <button onClick={() => setSelectedClub(club)}>Details</button>
          </div>
        ))}
      </div>

      {selectedClub && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedClub.cname}</h2>
            <p><strong>Description:</strong> {selectedClub.cdescription || 'N/A'}</p>
            <p><strong>Founded:</strong> {selectedClub.cdate ? new Date(selectedClub.cdate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Achievements:</strong> {selectedClub.cachievement || 'N/A'}</p>
            <p><strong>Social Links:</strong> {selectedClub.csocial || 'N/A'}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClubsPage;
