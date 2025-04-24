import React, { useState } from "react";
import "./ClubLogin.css"; 
import axios from "axios";

const ClubLogin = () => {
  const [cid, setCid] = useState("");
  const [cpassword, setCPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/club/login", { cid, cpassword });
      alert("Login successful!");
      // navigate to dashboard or set auth token
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="container">
      <img src="/images/oca.jpg" alt="OCA Logo" />
      <h2>Club Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="number"
            name="cid"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            required
            placeholder=" "
          />
          <label>Enter Club ID</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            name="cpassword"
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
            required
            placeholder=" "
          />
          <label>Enter your password</label>
        </div>
        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Log In</button>
        <div className="register">
          <p>Back to <a href="App.js">Login Selection</a></p>
        </div>
      </form>
    </div>
  );
};

export default ClubLogin;
