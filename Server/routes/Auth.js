const express = require("express")
const authRouter = express.Router();
const nodemailer = require("nodemailer");
const { User } = require("../config");
const { generateOTP } = require("../Authentication/otp");
const jwt = require("jsonwebtoken");

// Transporter For Sending Mail
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL,  
      pass: process.env.TEMP_PASSWORD
    }
});

// Routes
authRouter.post("/signup",async(req,res) => {
    try{
        const existUser = await User.find({email:req.body.email})
        
        if(existUser.length !== 0){
            return res.json({"message":"Account Already Exists"});
        }
        else{

            const user = new User({
                email:req.body.email,
                password:req.body.password
            })
            
            const admins = await User.find({role:"admin"});

            admins.forEach(async(admin) => {
                await User.updateOne(
                    { _id: admin._id },
                    { "$push": {
                        "pendingRequest": user
                    } }
                )
            })
            res.json({"message":"Request Sent to Admin"});
        }
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some error Occured"})
    }
})

authRouter.post("/login",async(req,res) => {
    try{
        const user = await User.find({ email:req.body.email })        
        
        if(user.length === 0){
            const requests = await User.find(
                {role:"admin", "pendingRequest.email": req.body.email }, 
                { pendingRequest:1 ,_id:0})
    
            if(requests.length !== 0){
                return res.status(404).json({"request":true})
            }
            res.status(404).json({"message":"User not Found"})
        }
        else{
            if(user[0].blocked){
                return res.status(401).json({"message":"You are Blocked by the Admin."})
            }
            if(user[0].password === req.body.password){

                // JWT Token
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                  );
                  
                res.json({"message":"Logged in Successfully","uid":user[0]._id,"token":token, "role":user[0].role});
            }
            else{
                res.status(400).json({"message":"Wrong Password.Try Again"});
            }
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({"message":"Some error Occured"})
    }
})

authRouter.post("/sendOTP",async(req,res) => {
    try{
        let otp = generateOTP();
        
        const mailOptions = {
            from: "AICOMP",
            to: req.body.email,
            subject: 'OTP for AICOMP',
            text: `Welcome to AICOMP,\n\nThis is your OTP to verify your account: ${otp}.\n\nWe never share your email to anyone.`
        };
    
        // Send email
        transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({"message":'Internal Server Error'});
        }
    });

        res.json({otp})

    }
    catch(err){
        console.error("Some error Occured");
        res.status(500).json({"message":"Some error Occured"})
    }

})

module.exports = authRouter;