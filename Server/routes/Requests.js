const express = require("express")
const RequestRouter = express.Router();
const mongoose = require("mongoose");
const { User, collection, pendingUsers } = require("../config");
const { authenticateToken, authorizeRole } = require("../middleware/auth")
const acceptTemplate = require("../emailTemplates/acceptTemplate")
const nodemailer = require("nodemailer");

RequestRouter.use(authenticateToken);

// Transporter For Sending Mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL,
      pass: process.env.TEMP_PASSWORD, 
  },
  tls: {
      rejectUnauthorized: false 
  }
});


// Routes
RequestRouter.get("/getRequestedUsers", authorizeRole('admin') , async (req, res) => {
  try {
    const requests = await pendingUsers.find({})

    if (requests.length !== 0) {
      return res.json(requests)
    }
    else {
      return res.json([])
    }
  }
  catch (err) {
    console.error(err);
    res.json({ "message": "Some Error Occured" })
  }
})

// Accept Only necessary user
RequestRouter.get("/acceptRequest/:id", authorizeRole('admin') ,async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);

    const requests = await pendingUsers.find({_id:objectId})

    if (requests.length !== 0) {
      const newUser = new User({email:requests[0].email,password:requests[0].password});

      const exams = await collection.find({});

      let initialExamScore = [];
      exams.forEach((exam) => {
        initialExamScore.push({
          exam_id: exam._id,
          name: exam.name,
          attempted: false,
          questions: [...exam.questions],
          score: {}
        })
      })

      newUser.exams = initialExamScore;
      await newUser.save();

      const removeUser = await pendingUsers.deleteOne({ _id: objectId })

      // Send mail to User about Request Accept
      const mailOptions = {
        from: "AICOMP <no-reply@aicomp.com>",
        to: newUser.email,
        subject: 'Login Request Accepted',
        html: acceptTemplate(newUser.email)
      };

      // Send email
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ "message": 'Internal Server Error' });
        }
      })


      res.json({ "message": "Request Accepted Successfully" });
    }
    else {
      return res.json({ "message": "No Pending Requests" })
    }
  }
  catch (err) {
    console.error(err);
    res.json({ "message": "Some Error Occured" })
  }
})

// Accept All
RequestRouter.get("/acceptAllRequest", authorizeRole('admin') ,async (req, res) => {
  try {

    const requests = await pendingUsers.find({})

    if (requests.length === 0) {
      return res.json({ "message": "No pending Request." })
    }

    const exams = await collection.find({});

    let initialExamScore = [];
    exams.forEach((exam) => {
      initialExamScore.push({
        exam_id: exam._id,
        name: exam.name,
        attempted: false,
        questions: [...exam.questions],
        score: {}
      })
    })

    for (const request of requests) {


      // Send mail to Users about Request Accept
      const mailOptions = {
        from: "AICOMP <no-reply@aicomp.com>",
        to: request.email,
        subject: 'Login Request Accepted',
        html: acceptTemplate(request.email)
      };

      // Send email
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ "message": 'Internal Server Error' });
        }
      })


      let newUser = new User({email:request.email,password:request.password});

      newUser.exams = initialExamScore;

      await newUser.save();

      // Removing user from admin's request array
      await pendingUsers.deleteOne({ _id: request._id });
    }

    res.json({ "message": "All Requests are Accepted." });
  }
  catch (err) {
    console.error(err);
    res.json({ "message": "Some Error Occured" });
  }
})

module.exports = RequestRouter;