import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed useEffect, NavLink, useLocation
import styles from './ClubLogin.module.css';

const ClubLogin = () => {
  const navigate = useNavigate();
  const [cid, setCid] = useState('');
  const [cpassword, setCpassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending CID:', cid, 'Password:', cpassword);
    try {
      const res = await fetch('http://localhost:3001/api/clubs/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cid, cpassword })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login Successful');
        console.log('Attempting to navigate to /club-dashboard');
        navigate('/club-dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed (Frontend)');
    }
  };
  return (
    <div className={styles.clubLoginBody}>
      <div className={styles.clubLoginContainer}>
        <img src="/images/oca.jpg" alt="OCA Logo" className={styles.clubLoginContainer__img} />
        <h2 className={styles.clubLoginContainer__h2}>Club Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.clubLoginContainer__inputGroup}>
            <input
              type="number"
              name="cid"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              required
              placeholder=" "
              className={styles.clubLoginContainer__inputGroup__input}
            />
            <label className={styles.clubLoginContainer__inputGroup__label}>Enter Club ID</label>
          </div>
          <div className={styles.clubLoginContainer__inputGroup}>
            <input
              type="password"
              name="cpassword"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              required
              placeholder=" "
              className={styles.clubLoginContainer__inputGroup__input}
            />
            <label className={styles.clubLoginContainer__inputGroup__label}>Enter your password</label>
          </div>
          <div className={styles.clubLoginContainer__options}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/" className={styles.clubLoginContainer__options__a}>Forgot password?</a>
          </div>
          <button type="submit" className={styles.clubLoginContainer__button}>Log In</button>
          <div className={styles.clubLoginContainer__register}>
            <p>Back to <a href="/login-club" className={styles.clubLoginContainer__register__a}>Login Selection</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubLogin;