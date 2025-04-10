const express = require("express")
const ScoreRouter = express.Router()
const mongoose = require("mongoose")
const { collection,User } = require("../config");
const authenticateToken = require("../middleware/auth")

ScoreRouter.use(authenticateToken);

// Scores Router
ScoreRouter.get("/getuserScores/:id",async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.query.user_id);

        const scores = await User.find(
          {
            _id: userId,
            "exams.exam_id": examId
          },
          {
            "exams": { $elemMatch: { exam_id: examId } },
            _id: 0
          }
        );
          
        if(scores){
            res.json(scores[0].exams[0].score);
        }
        else{
            res.json({"message":"User not Found"});
        }
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }  
})

ScoreRouter.put("/setuserScores/:id",async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.query.user_id);

        const newScore = {
                testCasesPassed: req.body.testCasesPassed,
                totalTestCases: req.body.totalTestCases,
                timeTaken: req.body.timeTaken,
                givenTime: req.body.givenTime,
                numOfSubmissions: req.body.numOfSubmissions 
        }
          
          const score = await User.findOneAndUpdate(
            { 
              _id: userId,  
              "exams.exam_id": examId 
            },
            { 
              $set: {
                "exams.$.attempted": 'true' ,
                "exams.$.score": newScore
              }
            },
            { 
              new: true  
            }
          );  
        
        if(score){
            res.json({"message":"Exam Completed Successfully"})
        }
        else{
            res.json({"message":"User not Found"})
        }
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }  
})


ScoreRouter.get("/getFormattedScoreForAdmin", async(req,res) => {
  try{
    const exams = await collection.find({},{ _id:1, name:1 })
    const users = await User.find({role:"user", blocked:false},{ _id:1,exams:1,email:1 })
    
    let finalData = []

    exams.map((exam) => {
      let scoreToset = null;
      let status = null;
      let data = { id:exam._id,name:exam.name, users:[] }
      for(let i=0;i<users.length;i++){
        // Finding Matched Exam and setting status and score
        for(let j=0;j<users[i].exams.length;j++){
          // Checking Exam Id and User Exam Id
          if((users[i].exams[j].exam_id).equals(exam._id)){
            status = users[i].exams[j].attempted
            scoreToset = users[i].exams[j].score.finalScore ?? null
            break
          }
        }
        data.users.push({ id:users[i]._id, email: users[i].email, score:scoreToset, status:status })
      }
      finalData.push(data)
    })

    res.json(finalData);

  }
  catch(err){
    console.error(err);
    res.status(500).json({message:"Internal Server Error"})
  }
})

module.exports = ScoreRouter