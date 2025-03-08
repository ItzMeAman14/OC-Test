const express = require("express")
const RequestRouter = express.Router();
const mongoose = require("mongoose");
const { User, collection } = require("../config");
const authenticateToken = require("../middleware/auth")
const acceptTemplate = require("../emailTemplates/acceptTemplate")
const nodemailer = require("nodemailer");

RequestRouter.use(authenticateToken);

// Transporter For Sending Mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.TEMP_PASSWORD
    }
});


// Routes
RequestRouter.get("/getRequestedUsers", async (req, res) => {
  try {
    const requests = await User.find(
      { role: "admin" },
      { pendingRequest: 1, _id: 0 })

    if (requests.length !== 0) {
      return res.json(requests[0].pendingRequest)
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

// Accept Only necessary user
RequestRouter.get("/acceptRequest/:id", async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);

    const requests = await User.aggregate([
      {
        $match: {
          role: "admin",
          "pendingRequest._id": objectId,
        }
      },
      {
        $project: {
          pendingRequest: {
            $filter: {
              input: "$pendingRequest",
              as: "request",
              cond: { $eq: ["$$request._id", objectId] }
            }
          },
          _id: 0
        }
      }
    ]);

    if (requests.length !== 0) {
      const newUser = new User(requests[0].pendingRequest[0]);

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

      const removeUser = await User.updateMany(
        { role: "admin" },
        {
          "$pull": {
            "pendingRequest": { _id: objectId }
          }
        }
      )

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
RequestRouter.get("/acceptAllRequest", async (req, res) => {
  try {

    const requests = await User.find(
      { role: "admin" }, { "pendingRequest": 1 }
    )

    if (requests[0].pendingRequest.length === 0) {
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

    for (const request of requests[0].pendingRequest) {


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


      let newUser = new User(request);

      newUser.exams = initialExamScore;

      await newUser.save();

      // Removing user from admin's request array
      await User.updateMany(
        { role: "admin" },
        {
          "$pull": {
            "pendingRequest": { _id: request._id }
          }
        }
      );
    }

    res.json({ "message": "All Requests are Accepted." });
  }
  catch (err) {
    console.error(err);
    res.json({ "message": "Some Error Occured" });
  }
})

module.exports = RequestRouter;