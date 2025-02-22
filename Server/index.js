const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config();
const msgRoute = require('./routes/messages');
const ExamRouter = require("./routes/Exams");
const QuestionRouter = require("./routes/Questions");
const ScoreRouter = require("./routes/Scores");
const authRouter = require("./routes/Auth");
app.use(cors());
app.use(express.json());


// Routes
app.use("/msg",msgRoute);
app.use("/",ExamRouter);
app.use("/",QuestionRouter);
app.use("/",ScoreRouter);
app.use("/auth",authRouter)


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



app.listen(7123, () => {
    console.log("Listening on http://localhost:7123/");
})