import React, { useState, useEffect } from 'react';
import './JoinClubsPage.css';

const API_BASE_URL = 'http://localhost:3001/api';

function JoinClubsPage() {
  const [recruitingClubs, setRecruitingClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check authentication
        const authResponse = await fetch(`${API_BASE_URL}/students/check-auth`, {
          credentials: 'include'
        });
        const authData = await authResponse.json();
        
        if (!authData.isLoggedIn) {
          window.location.href = '/login';
          return;
        }
        
        setStudent(authData.student);

        // Fetch recruiting clubs
        const clubsResponse = await fetch(`${API_BASE_URL}/recruitment/recruiting/active`, {
          credentials: 'include'
        });
        const clubsData = await clubsResponse.json();
        
        // Ensure all arrays exist
        const normalizedClubs = clubsData.map(club => ({
          ...club,
          pending_std: club.pending_std || [],
          approved_std: club.approved_std || [],
          rejected_std: club.rejected_std || []
        }));
        
        setRecruitingClubs(normalizedClubs);
        setFilteredClubs(normalizedClubs);

        // Fetch pending count
        const countResponse = await fetch(`${API_BASE_URL}/students/pending-count`, {
          credentials: 'include'
        });
        const countData = await countResponse.json();
        setPendingCount(countData.pendingCount || 0);

      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClubs(recruitingClubs);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = recruitingClubs.filter(club => 
      club.clubName.toLowerCase().includes(term) || 
      String(club.cid).includes(term)
    );
    setFilteredClubs(filtered);
  }, [searchTerm, recruitingClubs]);

  const handleRegister = async (recruitmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/register-club`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recruitmentId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      const result = await response.json();
      setPendingCount(result.pendingCount || pendingCount + 1);
      
      setRecruitingClubs(prev => 
        prev.map(club => {
          if (club._id === recruitmentId && student?.uid) {
            return {
              ...club,
              pending_std: [...(club.pending_std || []), student.uid]
            };
          }
          return club;
        })
      );
  
      alert(result.message || 'Registration successful!');
    } catch (err) {
      console.error('Registration error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Join Clubs</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Join Clubs</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Join Clubs</h1>
      
      <div className="controls">
        <div className="pending-count">
          Pending Applications: <span>{pendingCount}</span>
        </div>
        
        <div className="search">
          <input
            type="text"
            placeholder="Search by club name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="clubs-grid">
        {filteredClubs.length > 0 ? (
          filteredClubs.map(club => {
            const studentUid = student?.uid;
            const pendingStudents = club.pending_std || [];
            const approvedStudents = club.approved_std || [];
            const rejectedStudents = club.rejected_std || [];
            
            const isPending = studentUid && pendingStudents.includes(studentUid);
            const isApproved = studentUid && approvedStudents.includes(studentUid);
            const isRejected = studentUid && rejectedStudents.includes(studentUid);
            
            let status = null;
            let buttonText = 'Register';
            let disabled = false;
            
            if (isApproved) {
              status = 'Approved';
              disabled = true;
            } else if (isRejected) {
              status = 'Rejected';
              disabled = true;
            } else if (isPending) {
              buttonText = 'Applied';
              disabled = true;
            }

            return (
              <div key={club._id} className="club-card">
                <h3>{club.clubName} (ID: {club.cid})</h3>
                <p>Semester: {club.semester}</p>
                <p>Deadline: {new Date(club.application_deadline).toLocaleDateString()}</p>
                <p>{club.description || 'No description available'}</p>
                
                <div className="actions">
                  {status ? (
                    <span className={`status ${status.toLowerCase()}`}>{status}</span>
                  ) : (
                    <button
                      onClick={() => handleRegister(club._id)}
                      disabled={disabled}
                    >
                      {buttonText}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-results">
            {recruitingClubs.length === 0 
              ? 'No clubs are currently recruiting' 
              : 'No clubs match your search'}
          </p>
        )}
      </div>
    </div>
  );
}

export default JoinClubsPage;