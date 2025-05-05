// backend/routes/studentAuth.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student.js'); // Ensure path is correct
const Recruitment = require('../models/recruitment.js');
console.log("✅ studentAuth.js loaded");

// --- AUTHENTICATION MIDDLEWARE ---
const authStudent = (req, res, next) => {
  if (req.session && req.session.student) {
    req.student = req.session.student; // Attach student info to request
    next(); // User is authenticated, proceed
  } else {
    console.warn("Auth failed: No active student session.");
    // Sending 401 means the client needs to authenticate
    res.status(401).json({ message: "Authentication failed. Please log in." });
  }
};
// --- END AUTHENTICATION MIDDLEWARE ---


// --- STUDENT LOGIN ---
router.post("/login", async (req, res) => {
    // ... (your existing login logic remains here) ...
    const { uid, upassword } = req.body;
    try {
        if (!uid || !upassword) {
            return res.status(400).json({ message: "Student ID and password are required" });
        }
        const studentUidNumber = Number(uid);
        if (isNaN(studentUidNumber)) {
             return res.status(400).json({ message: "Invalid Student ID format" });
        }
        const student = await Student.findOne({ uid: studentUidNumber });
        if (!student) {
            console.log(`Login attempt failed: UID ${studentUidNumber} not found.`);
            return res.status(401).json({ message: "Invalid Student ID or password" });
        }
        if (upassword === student.upassword) {
            req.session.student = {
                _id: student._id.toString(),
                uid: student.uid,
                uname: student.uname
            };
            req.session.save(err => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ message: "Server error during login (session save)" });
                }
                console.log(`Login successful for UID: ${student.uid}, Session student set:`, req.session.student);
                res.status(200).json({
                    message: "Login successful",
                    student: {
                        _id: student._id,
                        uid: student.uid,
                        uname: student.uname
                    }
                });
            });
        } else {
             console.log(`Login attempt failed: Incorrect password for UID ${studentUidNumber}.`);
            return res.status(401).json({ message: "Invalid Student ID or password" });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// --- CHECK LOGIN STATUS ---
router.get("/check-auth", (req, res) => {
    // ... (your existing check-auth logic remains here) ...
    if (req.session && req.session.student) {
        res.status(200).json({ isLoggedIn: true, student: req.session.student });
    } else {
        console.log("Auth check: No active session found.");
        res.status(200).json({ isLoggedIn: false });
    }
});


// --- STUDENT LOGOUT ---
router.post("/logout", (req, res) => {
    // ... (your existing logout logic remains here) ...
    if (req.session) {
        const studentUid = req.session.student?.uid;
        req.session.destroy(err => {
            if (err) {
                console.error("Logout Error:", err);
                return res.status(500).json({ message: "Could not log out, please try again." });
            } else {
                res.clearCookie('connect.sid');
                 console.log(`Logout successful for UID: ${studentUid}`);
                return res.status(200).json({ message: "Logout successful" });
            }
        });
    } else {
        return res.status(200).json({ message: "No active session to log out from." });
    }
});


// --- GET CLUBS FOR A STUDENT ---
router.get("/:studentId/clubs", async (req, res) => {
    // ... (your existing clubs logic remains here) ...
    const { studentId } = req.params;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ clubs: student.clubs });
    } catch (err) {
        console.error("Error fetching student clubs:", err);
        res.status(500).json({ message: "Server error while fetching clubs" });
    }
});


// --- REGISTER STUDENT FOR CLUB RECRUITMENT ---
router.post('/register-club', authStudent, async (req, res) => {
    const { recruitmentId } = req.body;
    const studentUid = req.student.uid;
  
    try {
      const recruitment = await Recruitment.findById(recruitmentId);
      if (!recruitment) {
        return res.status(404).json({ message: 'Recruitment not found' });
      }
  
      // Check if already applied
      if (
        recruitment.pending_std.includes(studentUid) ||
        recruitment.approved_std.includes(studentUid) ||
        recruitment.rejected_std.includes(studentUid)
      ) {
        return res.status(400).json({ message: 'You have already applied to this club' });
      }
  
      // Add to pending list
recruitment.pending_std.push(studentUid);
await recruitment.save();

// Also update student's pending clubs
const student = await Student.findOne({ uid: studentUid });
if (student && !student.pen_clubs.includes(recruitment.cid)) {
  student.pen_clubs.push(recruitment.cid);
  await student.save();
}
      // Count total pending applications for this student
      const allRecruitments = await Recruitment.find({
        pending_std: studentUid
      });
      const pendingCount = allRecruitments.length;
  
      res.status(200).json({
        message: 'Registration successful',
        pendingCount
      });
  
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error during registration' });
    }
  });
  // --- GET PENDING INTERVIEWS COUNT ---
  router.get('/pending-count', authStudent, async (req, res) => {
    try {
      const student = await Student.findOne({ uid: req.student.uid });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ pendingCount: student.pen_clubs.length });
    } catch (err) {
      console.error('Error getting pending count:', err);
      res.status(500).json({ message: 'Error getting pending count' });
    }
  });

module.exports = {
    router: router,       // Export the router under the 'router' key
    authStudent: authStudent // Export the middleware under the 'authStudent' key
};