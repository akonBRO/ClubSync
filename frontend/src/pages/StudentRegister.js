import React, { useState } from 'react';
import axios from 'axios';
import './StudentRegister.css';

function StudentRegister() {
  const [formData, setFormData] = useState({
    uname: '',
    dob: '',
    umail: '',
    uid: '',
    umobile: '',
    ugender: '',
    upassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/students/register', formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed Frontend");
    }
  };

  return (
    <div className="container">
      <header>User Registration</header>
      <form onSubmit={handleSubmit}>
        <div className="form first">
          <div className="details personal">
            <span className="title">Personal Details</span>
            <div className="fields">
              <div className="input-field"><label>Full Name</label><input type="text" name="uname" onChange={handleChange} required /></div>
              <div className="input-field"><label>Date of Birth</label><input type="date" name="dob" onChange={handleChange} required /></div>
              <div className="input-field"><label>Email</label><input type="email" name="umail" onChange={handleChange} required /></div>
              <div className="input-field"><label>Student ID</label><input type="number" name="uid" onChange={handleChange} required /></div>
              <div className="input-field"><label>Mobile Number</label><input type="number" name="umobile" onChange={handleChange} required /></div>
              <div className="input-field"><label>Gender</label>
                <select name="ugender" onChange={handleChange} required>
                  <option disabled selected value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Others</option>
                </select>
              </div>
              <div className="input-field"><label>Password</label><input type="password" name="upassword" onChange={handleChange} required /></div>
            </div>
          </div>
          <button className="submit" type="submit"><span className="btnText">Submit</span></button>
          <p>Back to <a href="/student-login">Login</a></p>
        </div>
      </form>
    </div>
  );
}

export default StudentRegister;
