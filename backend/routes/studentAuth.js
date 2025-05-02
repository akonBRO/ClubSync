const express = require('express');
const router = express.Router();
const Student = require('../models/student.js');

console.log("✅ studentRoutes.js loaded");

router.post("/login", async (req, res) => {
    const { uid, upassword } = req.body;

    try {
        if (!uid || !upassword) {
            return res.status(400).json({ message: "Student ID and password are required" });
        }

        const student = await Student.findOne({ uid });

        if (!student) {
            return res.status(401).json({ message: "Invalid Student ID or password" });
        }

        // WARNING: Directly comparing plain text passwords is insecure!
        if (upassword === student.upassword) {
            // Password is correct, send a success response (don't send the password!)
            res.status(200).json({ message: "Login successful", student: { _id: student._id, uname: student.uname } });
        } else {
            return res.status(401).json({ message: "Invalid Student ID or password" });
        }

    } catch (err) {
        console.error("MongoDB Login Error:", err.message);
        res.status(500).json({ message: "Server error during login" });
    }
});

router.get("/:studentId/clubs", async (req, res) => {
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

module.exports = router;