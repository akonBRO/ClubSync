import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import Lucide icons
import {
  Building,
  BadgeInfo,
  CalendarDays,
  Megaphone,
  PlayCircle,
  XCircle,
  CalendarClock,
  FileText,
  Send,
  ListChecks,
  StopCircle,
  Loader,
  AlertTriangle,
  Users,
  UserCheck,
  UserX,
  CheckCircle,
  Info,
} from 'lucide-react';
// Import the CSS module
import styles from './ClubRecruitments.module.css';

const ClubRecruitments = () => {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' }); // For feedback

  // --- Define current semester (Consider making this dynamic) ---
  // You might fetch this from an API or calculate it based on the current date
  const currentSemester = 'Spring 2025';

  // --- Fetch Club and Recruitment Data ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setStatusMessage({ type: '', text: '' }); // Clear message on refetch
    try {
      // Fetch club details first (assuming this endpoint sets credentials/session correctly)
      const clubRes = await axios.get('http://localhost:3001/api/clubs/dashboard', { withCredentials: true });
      if (clubRes.data && clubRes.data.clubDetails) {
        const fetchedClub = clubRes.data.clubDetails;
        setClub(fetchedClub);

        // Then fetch recruitments for this club
        const recruitmentRes = await axios.get(`http://localhost:3001/api/recruitment/${fetchedClub._id}`, { withCredentials: true });
        // Sort recruitments, maybe newest first? (Optional)
        setRecruitments(recruitmentRes.data.sort((a, b) => b.semester.localeCompare(a.semester))); // Example sort
      } else {
        throw new Error("Club details not found.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message || "Failed to load data. Please ensure you are logged in as a club representative.");
      setClub(null);
      setRecruitments([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this useCallback memoizes the function itself

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Run fetchData on mount and if fetchData changes (which it shouldn't here)

  // --- Handle Start Recruitment ---
  const startRecruitment = async () => {
    if (!club || !deadline || !description.trim()) {
      setStatusMessage({ type: 'error', text: 'Please set a deadline and provide a description.' });
      return;
    }
    setStatusMessage({ type: '', text: '' }); // Clear previous message
    try {
      const res = await axios.post('http://localhost:3001/api/recruitment/create', {
        clubId: club._id,
        clubName: club.cname,
        semester: currentSemester,
        application_deadline: deadline,
        description
      }, { withCredentials: true });

      setStatusMessage({ type: 'success', text: res.data.message || 'Recruitment started successfully!' });
      // Add the new recruitment to the top and refetch/update state cleanly
      setRecruitments(prev => [res.data.recruitment, ...prev.filter(r => r.semester !== currentSemester)]);
      // Clear form
      // setDeadline(''); // Keep deadline maybe?
      // setDescription('');
    } catch (err) {
      console.error("Error starting recruitment:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to start recruitment.' });
    }
  };

  // --- Handle Stop Recruitment ---
  const stopRecruitment = async (semester) => {
     if (!club) return;
     if (!window.confirm(`Are you sure you want to stop recruitment for ${semester}?`)) {
        return;
     }
    setStatusMessage({ type: '', text: '' });
    try {
      await axios.put('http://localhost:3001/api/recruitment/stop', {
        clubId: club._id,
        semester
      }, { withCredentials: true });

      setRecruitments(prev => prev.map(r => r.semester === semester ? { ...r, status: 'no' } : r));
      setStatusMessage({ type: 'info', text: `Recruitment for ${semester} stopped.` });
    } catch (err) {
      console.error("Error stopping recruitment:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to stop recruitment.' });
    }
  };

  // --- Determine Current Recruitment Status ---
  const currentRecruitmentInfo = recruitments.find(r => r.semester === currentSemester);
  const isCurrentlyRecruiting = currentRecruitmentInfo?.status === 'yes';

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.spinner} size={48} />
        <p>Loading Club Recruitment Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={40} className={styles.errorIcon} />
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={fetchData} className={styles.retryButton}>Retry</button>
      </div>
    );
  }

  if (!club) {
     return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={40} className={styles.errorIcon} />
        <h2>Club Information Missing</h2>
        <p>Could not load club details. Please try logging in again.</p>
         {/* Optionally add a login button */}
      </div>
    );
  }

  return (
    <div className={styles.recruitmentPage}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <h1><Megaphone size={28} /> Club Recruitment Management</h1>
        <div className={styles.clubInfo}>
          <span><Building size={16} /> {club.cname}</span>
          <span><BadgeInfo size={16} /> ID: {club.cid}</span>
        </div>
      </header>

       {/* Status Message Area */}
        {statusMessage.text && (
            <div className={`${styles.statusMessage} ${styles[statusMessage.type]}`}>
                {statusMessage.type === 'success' && <CheckCircle size={18} />}
                {statusMessage.type === 'error' && <AlertTriangle size={18} />}
                {statusMessage.type === 'info' && <Info size={18} />}
                <span>{statusMessage.text}</span>
                <button onClick={() => setStatusMessage({ type: '', text: '' })} className={styles.closeMessage}>&times;</button>
            </div>
        )}


      {/* Current Semester & Status */}
      <section className={styles.currentStatusSection}>
        <div className={styles.semesterInfo}>
           <CalendarDays size={20} />
           <span>Current Semester: <strong>{currentSemester}</strong></span>
        </div>
        <div className={`${styles.recruitmentStatus} ${isCurrentlyRecruiting ? styles.active : styles.inactive}`}>
          {isCurrentlyRecruiting ? <PlayCircle size={20} /> : <XCircle size={20} />}
          <span>Status: {isCurrentlyRecruiting ? 'Currently Recruiting' : 'Not Currently Recruiting'}</span>
        </div>
      </section>

      {/* Start Recruitment Form (Show if not currently recruiting or no record exists) */}
      {!isCurrentlyRecruiting && (
        <section className={styles.startFormSection}>
          <h3><Send size={20} /> Start New Recruitment for {currentSemester}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="deadline"><CalendarClock size={16} /> Application Deadline</label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}> {/* Span full width */}
              <label htmlFor="description"><FileText size={16} /> Recruitment Description</label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide details about the recruitment process, requirements, positions available, etc."
                className={styles.formTextarea}
                rows={4}
              />
            </div>
          </div>
          <button onClick={startRecruitment} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnIcon}`}>
            <Send size={16} /> Start Recruitment
          </button>
        </section>
      )}

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Past Recruitments Section */}
      <section className={styles.pastRecruitmentsSection}>
        <h3><CalendarDays size={20} /> Recruitment History</h3>
        {recruitments.length === 0 ? (
            <p className={styles.noHistory}>No past recruitment data found for this club.</p>
        ) : (
            <div className={styles.recruitmentGrid}>
            {recruitments.map(rec => (
                <div key={rec.semester} className={styles.recruitmentCard}>
                <div className={styles.cardHeader}>
                    <h4>{rec.semester}</h4>
                    <span className={`${styles.cardStatus} ${rec.status === 'yes' ? styles.active : styles.inactive}`}>
                    {rec.status === 'yes' ? <PlayCircle size={14} /> : <XCircle size={14} />}
                    {rec.status === 'yes' ? 'Active' : 'Stopped'}
                    </span>
                </div>
                <div className={styles.cardBody}>
                    <p className={styles.applicantCount}>
                        <Users size={14} /> Pending: <strong>{rec.pending_std?.length || 0}</strong>
                    </p>
                    <p className={styles.applicantCount}>
                        <UserCheck size={14} /> Approved: <strong>{rec.approved_std?.length || 0}</strong>
                    </p>
                    <p className={styles.applicantCount}>
                        <UserX size={14} /> Rejected: <strong>{rec.rejected_std?.length || 0}</strong>
                    </p>
                     <p className={styles.deadlineInfo}>
                        <CalendarClock size={14} /> Deadline: {rec.application_deadline ? new Date(rec.application_deadline).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className={styles.cardFooter}>
                    <button
                    onClick={() => navigate(`/club/recruitments/evaluate/${rec.semester}`)}
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnIcon}`}
                    title="View and evaluate applicants"
                    >
                    <ListChecks size={16} /> Evaluate
                    </button>
                    {rec.status === 'yes' && (
                    <button
                        onClick={() => stopRecruitment(rec.semester)}
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnIcon}`}
                        title="Stop accepting new applications for this semester"
                    >
                        <StopCircle size={16} /> Stop
                    </button>
                    )}
                </div>
                </div>
            ))}
            </div>
        )}
      </section>
    </div>
  );
};

export default ClubRecruitments;