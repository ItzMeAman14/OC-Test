const express = require("express")
const UserRouter = express.Router();
const mongoose = require("mongoose");
const { User } = require("../config");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const nodemailer = require("nodemailer")
const blockTemplate = require("../emailTemplates/BlockTemplate")

UserRouter.use(authenticateToken)


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
UserRouter.get("/users",async(req,res) => {
    try{
        const users = await User.find({role:"user"});
        res.json(users);
    }
    catch(err){
        res.json({"message":"Some Error Occured"})
    }
})


UserRouter.get("/getUserById/:id",async(req,res) => {
    try{
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const users = await User.find({role:"user",_id:userId});
        res.json({_id:users[0]._id,email:users[0].email});
    }
    catch(err){
        res.json({"message":"Some Error Occured"})
    }
})

UserRouter.get("/getUser",async(req,res) => {
    try{
        const requests = await User.find(
            {role:"admin", "pendingRequest.email": req.query.email }, 
            { pendingRequest:1 ,_id:0})

        if(requests.length !== 0){
            return res.json({"request":true})
        }

        const user = await User.find({email:req.query.email});

        if(user.length === 0){
            res.json({"message":"No User Found"});
        }
        else{
            res.json({id:user[0]._id});
        }
    }
    catch(err){
        res.json({"message":"Some Error Occured"})
    }
})

UserRouter.post("/filterRequestUser", authorizeRole('admin') ,async(req,res) => {
    try{
        const users = await User.aggregate([
            {
              $match: {
                role: "admin",
                "pendingRequest.email": { 
                  "$regex": `${req.body.user}`, 
                  "$options": 'i'
                }
              }
            },
            {
              $project: {
                pendingRequest: {
                  $filter: {
                    input: "$pendingRequest",
                    as: "item",
                    cond: { 
                      $regexMatch: {
                        input: "$$item.email", 
                        regex: `${req.body.user}`,
                        options: "i"
                      }
                    }
                  }
                }
              }
            },
            {
                $project: {
                  pendingRequest: {
                    $map: {
                      input: "$pendingRequest",
                      as: "item",
                      in: {
                        email: "$$item.email",
                      }
                    }
                  }
                }
              }
          ]);
          
        res.json(users[0].pendingRequest);
    }
    catch(err){
        res.json({"message":"Some Error Occured"})
    }
})

UserRouter.post("/filterUser", authorizeRole("admin") ,async(req,res) => {
    try{
        const users = await User.find(
            { role:"user" , email: { "$regex": req.body.user, "$options":'i' } }    
        )
        
        res.json(users);
    }
    catch(err){
        res.json({"message":"Some Error Occured"})
    }
})


UserRouter.put("/blockUser/:id", authorizeRole('admin') ,async (req, res) => {
    try {
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const user = await User.find({ _id: objectId });

        if (!user || user.length === 0) {
            return res.status(404).json({ "message": "User not found" });
        }

        const userBlockStatus = user[0].blocked ? false : true;

        const updateResult = await User.updateOne(
            { _id: objectId },
            { "$set": { blocked: userBlockStatus } }
        );

        if (updateResult.nModified === 0) {
            return res.status(400).json({ "message": "User status not updated" });
        }

        // Prepare email
        const mailOptions = {
            from: "AICOMP <no-reply@aicomp.com>",
            to: user[0].email,
            subject: 'Block Status Updated',
            html: blockTemplate(user[0].email, userBlockStatus)
        };

        // Send email
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                (error);
                return res.status(500).json({ "message": 'Internal Server Error while sending email' });
            }

            if (userBlockStatus) {
                return res.json({ "message": "User Blocked Successfully" });
            } else {
                return res.json({ "message": "User Unblocked Successfully" });
            }
        });

    } catch (err) {
        return res.status(500).json({ "message": "Some Error Occurred" });
    }
});


UserRouter.get("/userExams/:id", async (req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const user = await User.find({_id: objectId });

        res.json(user[0].exams);
    }
    catch(err){
        res.json({"message":"Some Error Occured"})
    }
})



UserRouter.put("/userExamPending/:id",async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.query.user_id);
  
          const score = await User.findOneAndUpdate(
            { 
              _id: userId,  
              "exams.exam_id": examId 
            },
            { 
              $set: {
                "exams.$.attempted": 'pending'
              }
            },
            { 
              new: true  
            }
          );  
        
        if(score){
            res.json({"message":"Exam Started"})
        }
        else{
            res.json({"message":"User not Found"})
        }
    }
    catch(err){
        res.json({"message":"Some Error Occured"})
    } 
})

module.exports = UserRouter;