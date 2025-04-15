const express = require("express")
const QuestionRouter = express.Router()
const mongoose = require("mongoose")
const { collection, User } = require("../config");
const { authenticateToken, authorizeRole } = require("../middleware/auth")

QuestionRouter.use(authenticateToken);

// Questions CRUD
QuestionRouter.get("/getQuestion/:id", async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data = await collection.find({ 
            "questions._id": objectId },
            { "questions.$": 1 })
            
            res.json(data[0].questions)
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

QuestionRouter.post("/createQuestion/:id", authorizeRole('admin') ,async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        
        const data = await collection.findOneAndUpdate(
                { _id:objectId },
            {
                $push:{
                    "questions": req.body.question
                }
            },
            { returnDocument: 'after' }
        )
        
        // Create question in every user
        const users = await User.find({role:"user"});
        
        const userQuestion = { _id:data.questions[data.questions.length - 1]._id,...req.body.question };
        
        for(let user=0;user<users.length;user++){
            await User.updateOne(
                { "exams.exam_id" : objectId, _id: users[user]._id },
                {
                    "$push": {
                        "exams.$.questions": userQuestion
                    }
                }
            )
        }
    
    res.json({"message":"Question Added Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

QuestionRouter.put("/updateQuestion/:id", authorizeRole('admin') ,async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);

        const data =  await collection.findOneAndUpdate(
            { "questions._id": objectId }, 
            { "$set": { 
                "questions.$" : {
                    heading: req.body.question.heading,
                    statement: req.body.question.statement,
                    testcases: req.body.testCases,
                }
            } },
            { returnDocument: 'after' }
        );
        

        const newId = data.questions.filter( (ques) => {
            return ques.heading === req.body.question.heading
        })

        // Update Question in every user
        const users = await User.find({role:"user"});
        
        for(let user=0;user<users.length;user++){
            await User.updateOne(
                { "exams.questions._id" : objectId, _id: users[user]._id },
                {
                    "$set": {
                        "exams.$.questions.$[question]._id": newId[0]._id
                    }
                },
                {
                    arrayFilters: [
                      { 'question._id': objectId }
                    ]
                }
            )
        }
        

        res.json({message:"Question Updated Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

QuestionRouter.delete("/deleteQuestion/:id", authorizeRole('admin') , async(req,res) => {
    try{

        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const data =  await collection.updateOne(
            { "questions._id": objectId }, 
            { $pull: { questions: { _id: objectId } } } 
        );


        // Delete Question in every user
        const users = await User.find({role:"user"});
        
        for(let user=0;user<users.length;user++){
            await User.updateOne(
                { "exams.questions._id" : objectId, _id: users[user]._id },
                {
                    "$pull": {
                        "exams.$.questions" : { _id : objectId }
                    }
                },
                {
                    arrayFilters: [
                      { 'question._id': objectId }
                    ]
                }
            )
        }
        
        res.json({message:"Question Deleted Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

QuestionRouter.put("/passQuestion/:id" ,async(req,res) => {
    try{
        const quesId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.query.user_id);
        const exam_id = new mongoose.Types.ObjectId(req.query.exam_id);

        const data =  await User.updateOne(
            {   _id: userId ,
                "exams.exam_id": exam_id,
                "exams.questions._id": quesId                           
            }, 
            {
                $set: {
                  "exams.$.questions.$[elem].passed": true
                }
            },
            {
                arrayFilters: [
                  { "elem._id": quesId }
                ]
            }
        
        );
        res.json({message:"Question Submitted Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


module.exports = QuestionRouter