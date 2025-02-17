const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config();
const collection = require('./config');
app.use(cors());
app.use(express.json());

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


// Exams CRUD
app.get('/getAllExams',async (req,res) => {
    try{
        const data = await collection.find({});
        res.json(data);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

app.get('/getExam/:id', async (req,res) => {
    try{
        const data = await collection.find({_id:req.params.id});
        res.json(data);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


app.post('/createExam',async (req,res) => {
    try{
        const exam = new collection(req.body)
        await exam.save();
        res.json({"success":"Exam created Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

app.put("/updateExam/:id", async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const exam = collection.updateOne(
            { _id: objectId },
            { "$set": {
                name:req.body.name
            } })
        res.json({"message":"Name Updated Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


app.delete("/deleteExam/:id",async(req,res) => {
    try{
        const exam = await collection.deleteOne({_id:req.params.id});
        res.json({"message":"Exam Deleted Successfully"});
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

// Questions CRUD
app.get("/getQuestion/:id", async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data = await collection.find({ 
            "questions._id": objectId },
            { "questions.$": 1 })
            
            res.json(data)
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

app.post("/createQuestion/:id",async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data = await collection.updateOne(
            { _id:objectId },
        {
            $push:{
                "questions": req.body.question
            }
        }
    )
    
    res.json({"message":"Question Added Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

app.put("/updateQuestion/:id",async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data =  await collection.updateOne(
            { "questions._id": objectId }, 
            { "$set": { 
                "questions.$" : {
                    heading: req.body.question.heading,
                    statement: req.body.question.statement,
                    testcases: req.body.testCases,
                }
            } } 
        );
        
        res.json({message:"Question Updated Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

app.delete("/deleteQuestion/:id", async(req,res) => {
    try{

        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data =  await collection.updateOne(
            { "questions._id": objectId }, 
            { $pull: { questions: { _id: objectId } } } 
        );
        
        res.json({message:"Question Deleted Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

app.listen(7123, () => {
    console.log("Listening on http://localhost:7123/");
})