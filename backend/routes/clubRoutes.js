const express = require('express');
const router = express.Router();
const Club = require('../models/club'); // Create this model below

router.post('/register', async (req, res) => {
  console.log(req.body);
  const { cname, caname, cpname, cmail, cid, cmobile, cpassword } = req.body;

  try {
    if (!cname || !caname || !cpname || !cmail || !cid || !cmobile || !cpassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newClub = new Club({
      cname,
      caname,
      cpname,
      cmail,
      cid,
      cmobile,
      cpassword
    });

    await newClub.save();
    res.status(200).json({ message: 'Club registration successful' });

  } catch (err) {
    console.error('MongoDB Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
