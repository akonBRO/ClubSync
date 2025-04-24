// routes/club.js
const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { cid, cpassword } = req.body;
  // check credentials from DB
  if (cid === "1234" && cpassword === "test") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid ID or password" });
  }
});

module.exports = router;
