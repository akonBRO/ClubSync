const express = require('express');
const router = express.Router();
const Club = require('../models/club');
// const bcrypt = require('bcrypt'); // Comment out bcrypt import

router.post('/login', async (req, res) => {
  const { cid, cpassword } = req.body;

  try {
    const club = await Club.findOne({ cid: parseInt(cid) }); // Assuming CID is Number

    if (club) {
      // Direct password comparison (ONLY if you are NOT using hashing)
      if (cpassword === club.cpassword) {
        // Session management starts here
        req.session.clubId = club._id;
        req.session.clubName = club.cname;
        res.json({ success: true, message: 'Login successful', club: { _id: club._id, cname: club.cname } });
      } else {
        console.log('Password mismatch (direct comparison)');
        res.status(401).json({ success: false, message: 'Invalid ID or password' });
      }
    } else {
      console.log('Club not found with CID:', cid);
      res.status(401).json({ success: false, message: 'Invalid ID or password' });
    }
  } catch (error) {
    console.error('Error during club login:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Logout Route (add this if you don't have it already)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

// Middleware to check if the user is logged in (add this if you don't have it already)
const requireLogin = (req, res, next) => {
  if (req.session && req.session.clubId) {
    next(); // User is logged in, proceed
  } else {
    res.status(401).json({ message: 'Unauthorized' }); // User is not logged in
  }
};

// Example protected route (add this if you don't have a protected dashboard route)
router.get('/dashboard', requireLogin, async (req, res) => {
  try {
    const club = await Club.findById(req.session.clubId).select('-cpassword');
    if (club) {
      res.json({
        message: `Welcome to the club dashboard, ${club.cname}!`,
        clubId: club._id,
        clubName: club.cname,
        clubDetails: club,
      });
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;