const express = require("express")
const ExamRouter = express.Router()
const mongoose = require("mongoose")
const { collection, User } = require("../config");
const { authenticateToken, authorizeRole } = require("../middleware/auth")

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
        const userId = new mongoose.Types.ObjectId(req.query.user_id);
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const data = await User.find({"exams.exam_id":examId, _id: userId },{ _id:0, "exams.$":1 });
        res.json(data[0].exams);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


ExamRouter.post('/createExam', authorizeRole('admin') ,async (req,res) => {
    try{
        const exam = new collection(req.body)
        await exam.save();

        // Create exam in every user
        const users = await User.find({role:"user"})

        const userExam = { exam_id:exam._id ,questions:exam.questions,name:exam.name }
        
        for(let user=0;user<users.length;user++){
            await User.updateOne(
                { _id: users[user]._id },
                {
                    "$push": {
                        "exams": userExam
                    }
                }
            )
        }

        res.json({message:"Exam created Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

ExamRouter.put("/updateExamName/:id", authorizeRole('admin') , async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const exam = await collection.updateOne(
            { _id: objectId },
            { "$set": {
                name:req.body.name
            } })

        // Update exam in every user
        const users = await User.find({role:"user"})

        for(let user=0;user<users.length;user++){
            await User.updateOne(
                { _id: users[user]._id, "exams.exam_id": objectId },
                {
                    "$set": {
                        "exams.$.name": req.body.name
                    }
                }
            )
        }

        res.json({"message":"Name Updated Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


ExamRouter.delete("/deleteExam/:id", authorizeRole('admin') ,async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const exam = await collection.deleteOne({_id:examId});
        
        // Delete exam in every user
        const users = await User.find({role:"user"})

        for(let user=0;user<users.length;user++){
            await User.updateOne(
                { _id: users[user]._id, "exams.exam_id": examId },
                {
                    "$pull": {
                        "exams": { exam_id: examId } 
                    }
                }
            )
        }

        res.json({"message":"Exam Deleted Successfully"});
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


ExamRouter.get("/noOfTestcases/:id" ,async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const data =  await collection.aggregate([
            {
                $match: { _id: examId } 
            },
            {
              $unwind: "$questions" 
            },
            {
              $project: {  
                "testcasesCount": { $size: "$questions.testcases" } 
              }
            },
          ]);
        
        let totalTestCases = 0;
        data.forEach(testCase => {
            totalTestCases += testCase.testcasesCount;
        })

        res.json(totalTestCases);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


module.exports = ExamRouter