const express = require("express")
const ExamRouter = express.Router()
const mongoose = require("mongoose")
const { collection } = require("../config");
const authenticateToken = require("../middleware/auth")

ExamRouter.use(authenticateToken);

// Exams CRUD
ExamRouter.get('/getAllExams',async (req,res) => {
    try{
        const data = await collection.find({});
        res.json(data);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

ExamRouter.get('/getExam/:id', async (req,res) => {
    try{
        const data = await collection.find({_id:req.params.id});
        res.json(data);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


ExamRouter.post('/createExam',async (req,res) => {
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

ExamRouter.put("/updateExam/:id", async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const exam = await collection.updateOne(
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


ExamRouter.delete("/deleteExam/:id",async(req,res) => {
    try{
        const exam = await collection.deleteOne({_id:req.params.id});
        res.json({"message":"Exam Deleted Successfully"});
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


ExamRouter.get("/noOfTestcases/:id",async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data =  await collection.aggregate([
            {
                $match: { _id: objectId } 
            },
            {
              $unwind: "$questions" 
            },
            {
              $project: {
                "questionHeading": "$questions.heading",  
                "testcasesCount": { $size: "$questions.testcases" } 
              }
            }
          ]);
        
        res.json(data);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

ExamRouter.put("/completeExam/:id",async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const exam = await collection.updateOne(
            { _id: objectId },
            { "$set": {
                attempted:true
            } })
        res.json({"message":"Exam Completed Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }  
})

module.exports = ExamRouter