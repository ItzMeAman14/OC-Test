const express = require('express')
const app = express()
const cors = require('cors');
const { parse } = require('dotenv');
require('dotenv').config();
const collection = require('./config')
app.use(cors());
app.use(express.json());


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
        console.log(parseData);
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


app.post('/getAllExams',async (req,res) => {
    const data = await collection.find({});
    res.json(data);
})

app.post('/getExam', async (req,res) => {
    const data = await collection.find({_id:req.body.id});
    res.json(data);
})

app.post('/createExam',async (req,res) => {
    try{
        const exam = new collection(req.body);
        exam.save();
        res.json({"success":"Exam created Successfully"})
    }
    catch(err){
        res.json({"error":"Some Error Occured"})
    }
})

app.listen(7123, () => {
    console.log("Listening on http://localhost:7123/");
})