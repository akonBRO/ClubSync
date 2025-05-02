const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  cname: String,
  caname: String,
  cpname: String,
  cshortname: String,
  cmail: String,
  cmobile: Number,
  cid: Number,
  cpassword: String,
  cdescription: String,
  cdate: Date,
  cachievement: String,
  clogo: String,       // e.g. logo URL or file path
  csocial: String,     // e.g. social media links or JSON string
  cmembers: Number,
  cfund: Number,
  creq: { type: String, enum: ['Yes', 'No'], default: 'No' },
  semester: [String], // Array of semesters for recruitment
  req_id: [{           // Array of student applications
    studentId: {
      type: mongoose.Schema.Types.ObjectId, // Store the student's ID
      ref: 'Student' //  Reference the Student model (if you have one)
    },
    semester: String,   // Semester the student applied for
    status: {           // Application status
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    }
  }],
});

module.exports = mongoose.model('Club', clubSchema);