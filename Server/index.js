const express = require('express')
const app = express()
const cors = require('cors');
const nodemailer = require("nodemailer");
require('dotenv').config();
const msgRoute = require('./routes/messages');
const ExamRouter = require("./routes/Exams");
const QuestionRouter = require("./routes/Questions");
const ScoreRouter = require("./routes/Scores");
const authRouter = require("./routes/Auth");
const UserRouter = require("./routes/Users");
const RequestRouter = require("./routes/Requests");
const contactUsTemplate = require("./emailTemplates/contactTemplate");

// Protecting Routes using CORS
const allowedOrigins = ['http://localhost:3000'];
const options = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};


app.use(cors(options));
app.use(express.json());


// Routes
app.use("/msg",msgRoute);
app.use("/",ExamRouter);
app.use("/",QuestionRouter);
app.use("/",ScoreRouter);
app.use("/auth",authRouter)
app.use("/",UserRouter)
app.use('/',RequestRouter)


// Transporter For Sending Mail
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL,  
      pass: process.env.TEMP_PASSWORD
    }
});

// API JDOODLE
app.get("/credit", async(req,res) => {
    try{
        const response = await fetch('https://api.jdoodle.com/v1/credit-spent',{
            method:"POST",
            headers:{
                'Content-Type':"application/json"
            },
            body: JSON.stringify({
                clientId:process.env.JDOODLE_API_ID,
                clientSecret:process.env.JDOODLE_API_SECRET
            })
        })

        const data = await response.text();
        let parseData;
        try{
            parseData = JSON.parse(data);
        }
        catch(err){
            res.status(500).json({error:'Error parsing response from API'})
        }
        res.json(parseData);
    }
    catch(err){
        res.status(500).json({error:"Something went Wrong"});
    }

})

app.post('/execute', async (req, res) => {
    const { input, lang, userInputs } = req.body;
    let modifiedInput = userInputs.trim().split(",").join('\n');
    
    try {
        const response = await fetch('https://api.jdoodle.com/v1/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script: input,
                language: lang,
                stdin: modifiedInput,
                versionIndex: '0',
                clientId: process.env.JDOODLE_API_ID,
                clientSecret: process.env.JDOODLE_API_SECRET,
            }),
        });
        
        const data = await response.text();
        let parseData;
        try{
            parseData = JSON.parse(data);
        }
        catch(error){
            return res.status(500).json({error: "Error parsing response from API"});
        }
        res.json(parseData);
    } catch (error) {
        res.status(500).json({ error: 'Error executing code' });
    }
});


// Contact 
app.post('/contact-us', (req, res) => {
    try{
        const { name, email, message } = req.body;
        
        const mailOptions = {
            from: email,
            to: process.env.RECIEVE_MAIL_CONTACT,
            subject: 'Contact Us From AIComp',
            html: contactUsTemplate(name,email,message)
        };
    
        // Send email
        transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({"message":'Internal Server Error'});
        }
        res.status(200).json({"message":'Message sent successfully!'});
    });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error executing code' });
    }
});

app.listen(7123, () => {
    console.log("Listening on http://localhost:7123/");
})