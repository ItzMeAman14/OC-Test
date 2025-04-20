const express = require("express")
const authRouter = express.Router();
const nodemailer = require("nodemailer");
const { User, pendingUsers } = require("../config");
const { generateOTP } = require("../Authentication/otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require('dotenv').config()

// Templates
const otpTemplate = require("../emailTemplates/otpTemplate");
const requestTemplate = require("../emailTemplates/requestTemplate");
const forgetPTemplate = require("../emailTemplates/forgetPTemplate");
const authenticateRecoveryToken = require("../middleware/resetPasswordAuth");

// To send mail after every 5 request
let loginRequestCount = {};

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
authRouter.post("/signup", async (req, res) => {
    try {
        const existUser = await User.find({ email: req.body.email })

        if (existUser.length !== 0) {
            return res.json({ "message": "Account Already Exists" });
        }
        else {
            // Hashing password using bcrypt
            let hashedPassword = bcrypt.hashSync(req.body.password,10);

            const user = new pendingUsers({
                email: req.body.email,
                password: hashedPassword
            })

            await user.save();

            res.json({ "message": "Request Sent to Admin" });
        }
    }
    catch (err) {
        
        res.json({ "message": "Some error Occured" })
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const user = await User.find({ email: req.body.email })

        if (user.length === 0) {
            const requests = await pendingUsers.find({ "email": req.body.email })

            if(!loginRequestCount[user[0]._id]){
                loginRequestCount[user[0]._id] = 0
            }

            if (requests.length !== 0) {
                loginRequestCount[user[0]._id] += 1;
                if (loginRequestCount[user[0]._id] % 5 == 0) {

                    const mailOptions = {
                        from: "CCL <no-reply@ccl.com>",
                        to: req.body.email,
                        subject: 'Request For Login',
                        html: requestTemplate(req.body.email)
                    };

                    // Send email
                    transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).json({ "message": 'Internal Server Error' });
                        }
                    })

                    loginRequestCount[user[0]._id] = 0
                }

                return res.status(404).json({ "request": true })
            }
            res.status(404).json({ "message": "User not Found" })
        }
        else {
            if (user[0].blocked) {
                return res.status(401).json({ "message": "You are Blocked by the Admin." })
            }
            // Using bcrypt to check if password hash is correct
            if (bcrypt.compareSync(req.body.password,user[0].password)) {

                // JWT Token
                const token = jwt.sign(
                    { userId: user[0]._id, role: user[0].role },
                    process.env.JWT_SECRET,
                    { expiresIn: '6h' }
                );

                res.json({ "message": "Logged in Successfully", "uid": user[0]._id, "token": token, "role": user[0].role });
            }
            else {
                res.status(400).json({ "message": "Wrong Password.Try Again" });
            }
        }
    }
    catch (err) {
        
        res.status(500).json({ "message": "Some error Occured" })
    }
})

authRouter.post("/sendOTP", async (req, res) => {
    try {
        let otp = generateOTP();

        const mailOptions = {
            from: "CCL <no-reply@ccl.com>",
            to: req.body.email,
            subject: 'OTP for CCL',
            html: otpTemplate(otp)
        };

        // Send email
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ "message": 'Internal Server Error' });
            }
        });

        res.json({ otp })

    }
    catch (err) {
        console.error("Some error Occured");
        res.status(500).json({ "message": "Some error Occured" })
    }

})


authRouter.post('/sendRecoverOTP', async (req, res) => {
    try {
        let otp = generateOTP();

        const user = await User.find({ email: req.body.email });

        if (user.length === 0) {
            return res.status(404).json({ message: "No User Found" });
        } else {
            try {
                // JWT Token for Recovery Account
                const token = jwt.sign(
                    { userId: user[0]._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '5m' }
                );

                const mailOptions = {
                    from: "CCL <no-reply@ccl.com>",
                    to: req.body.email,
                    subject: 'OTP for Account Recovery',
                    html: forgetPTemplate(otp) 
                };

                transporter.sendMail(mailOptions); 
                return res.json({ otp, recoverId: token });

            } catch (err) {
                console.error(err)
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }

    } catch (err) {
        
        return res.status(500).json({ "message": "Some error Occurred" });
    }
});


authRouter.post('/reset-password', authenticateRecoveryToken, async (req, res) => {
    try {
        let hashedPassword = bcrypt.hashSync(req.body.password,10);
        const user = await User.updateOne(
            { email: req.body.email },
            { "$set": { password: hashedPassword } }
        )

        res.json({ "message": "Password Changed Successfully" })

    }
    catch (err) {
        console.error(err)
        res.status(500).json({ "message": "Internal Server Error" })
    }
})
module.exports = authRouter;