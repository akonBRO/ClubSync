const express = require('express');
const router = express.Router();
const Club = require('../models/club');

router.post('/register', async (req, res) => {
  console.log(req.body);
  const { cname, caname, cpname, cshortname, cmail, cmobile, cid, cpassword } = req.body;

  try {
    if (!cname || !caname || !cpname || !cshortname || !cmail || !cmobile || !cid || !cpassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newClub = new Club({
      cname,
      caname,
      cpname,
      cshortname,
      cmail,
      cmobile,
      cid,
      cpassword,
      cdescription: '',       // default empty
      cdate: null,            // default null (can be filled later)
      cachievement: '',       // default empty
      clogo: '',              // default empty
      csocial: '',            // default empty (or could be '{}')
      cmembers: 0 ,
      cfund:0,            // default 0
      creq: 'No',
      semester: [],
      req_id:[],
      
    });

    await newClub.save();
    res.status(200).json({ message: 'Club registration successful' });

  } catch (err) {
    console.error('MongoDB Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
