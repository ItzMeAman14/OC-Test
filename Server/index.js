// Imports
const express = require('express')
const app = express()
const cors = require('cors');
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const path = require("path")

// Routes
const msgRoute = require('./routes/messages');
const ExamRouter = require("./routes/Exams");
const QuestionRouter = require("./routes/Questions");
const ScoreRouter = require("./routes/Scores");
const authRouter = require("./routes/Auth");
const UserRouter = require("./routes/Users");
const RequestRouter = require("./routes/Requests");
const LeaderboardRoutes = require("./routes/Leaderboard");

// Templates
const deleteMessageTemplate = require("./emailTemplates/messageTemplate");
const contactUsTemplate = require("./emailTemplates/contactTemplate");

// Schema
const { messaging } = require("./config");

// Configurations
require('dotenv').config();

// Protecting Routes using CORS
const allowedOrigins = ['http://localhost:3000', 'https://campuscodelab.vercel.app'];
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
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
app.use("/msg", msgRoute);
app.use("/", ExamRouter);
app.use("/", QuestionRouter);
app.use("/", ScoreRouter);
app.use("/auth", authRouter)
app.use("/", UserRouter)
app.use('/', RequestRouter)
app.use("/", LeaderboardRoutes);


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

const jdoodleVersionIndex = {
    python3: "3",
    java: "4",
    cpp: "0",
    nodejs: null,
    go: "3",
    ruby: "3",
    php: "3",
    csharp: "4"
};


// API JDOODLE
app.get("/credit", async (req, res) => {
    try {
        const response = await fetch('https://api.jdoodle.com/v1/credit-spent', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                clientId: process.env.JDOODLE_API_ID,
                clientSecret: process.env.JDOODLE_API_SECRET
            })
        })

        const data = await response.text();
        let parseData;
        try {
            parseData = JSON.parse(data);
        }
        catch (err) {
            res.status(500).json({ error: 'Error parsing response from API' })
        }
        res.json(parseData);
    }
    catch (err) {
        res.status(500).json({ error: "Something went Wrong" });
    }

})

app.post('/execute', async (req, res) => {
    const { input, lang, userInputs } = req.body;
    let modifiedInput = userInputs.trim().split(",").join('\n');
    let versionIndex = jdoodleVersionIndex[lang];
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
                versionIndex: versionIndex,
                clientId: process.env.JDOODLE_API_ID,
                clientSecret: process.env.JDOODLE_API_SECRET,
            }),
        });

        const data = await response.text();
        let parseData;
        try {
            parseData = JSON.parse(data);
        }
        catch (error) {
            return res.status(500).json({ error: "Error parsing response from API" });
        }
        res.json(parseData);
    } catch (error) {
        res.status(500).json({ error: 'Error executing code' });
    }
});


// Contact 
app.post('/contact-us', (req, res) => {
    try {
        const { name, email, message, subject } = req.body;

        const mailOptions = {
            from: email,
            to: process.env.RECIEVE_MAIL_CONTACT,
            subject: `From CCL - ${subject}`,
            html: contactUsTemplate(name, email, message)
        };

        // Send email
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ "message": 'Internal Server Error' });
            }
            res.status(200).json({ "message": 'Message sent successfully!' });
        });
    }
    catch (err) {
        res.status(500).json({ "message": 'Internal Server Error' });
    }
});


// Cron Tab for Messages Deletion in 2 Days -- It checks every single day if the message is 2 days old
cron.schedule("0 0 * * *", async () => {
    try {
        const messages = await messaging.find({});

        const previousDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

        if (messages.length !== 0) {
            await messaging.deleteMany({ createdAt: { "$lt": previousDate } });

            const mailOptions = {
                from: 'CCL',
                to: process.env.RECIEVE_MAIL_CONTACT,
                subject: 'Messages Deletion Updates',
                html: deleteMessageTemplate()
            };

            // Send email
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(500).json({ "message": 'Internal Server Error' });
                }
                res.json({ "message": "Messages Deleted Successfully" });
            })
        }
    }
    catch (err) {
        res.status(500).json({ "message": 'Internal Server Error' });
        throw err;
    }
})


app.listen(7123, () => {
    console.log("Listening on http://localhost:7123/");
})