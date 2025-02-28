const express = require("express")
const QuestionRouter = express.Router()
const mongoose = require("mongoose")
const { collection } = require("../config");
const authenticateToken = require("../middleware/auth")

QuestionRouter.use(authenticateToken);

// Questions CRUD
QuestionRouter.get("/getQuestion/:id", async(req,res) => {
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

QuestionRouter.post("/createQuestion/:id",async(req,res) => {
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

QuestionRouter.put("/updateQuestion/:id",async(req,res) => {
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

QuestionRouter.delete("/deleteQuestion/:id", async(req,res) => {
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

QuestionRouter.put("/passQuestion/:id", async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data =  await collection.updateOne(
            { "questions._id": objectId }, 
            { "$set": { 
                "questions.$.passed" : true
            } } 
        );
        
        res.json({message:"Question Submitted Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


module.exports = QuestionRouter