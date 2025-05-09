const express = require("express")
const ScoreRouter = express.Router()
const mongoose = require("mongoose")
const { collection,User } = require("../config");
const { authenticateToken, authorizeRole } = require("../middleware/auth")

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
        if(scores.length !== 0){
          if(scores[0].exams[0].attempted === "pending" || scores[0].exams[0].attempted === "false"){
            res.json({noScores:true})
          }
          else{
            res.json(scores[0].exams[0].score);
          }
        }
        else{
            res.json({"message":"No Scores Found"});
        }
    }
    catch(err){
        console.error(err)
        res.json({noScores:true})
    }  
})

ScoreRouter.put("/setuserScores/:id" ,async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.query.user_id);

        const newScore = {
          testCasesPassed: req.body.testCasesPassed,
          totalTestCases: req.body.totalTestCases,
          timeTaken: req.body.timeTaken,
          givenTime: req.body.givenTime,
          numOfSubmissions: req.body.numOfSubmissions,
          finalScore: req.body.finalScore, 
          totalScore: req.body.totalScore
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
        
        res.json({"message":"Some Error Occured"})
    }  
})


ScoreRouter.get("/getFormattedScoreForAdmin", authorizeRole('admin') ,async(req,res) => {
  try{
    const exams = await collection.find({},{ _id:1, name:1 })
    const users = await User.find({role:"user", blocked:false},{ _id:1,exams:1,email:1 })
    
    let finalData = []

    exams.map((exam) => {
      let scoreToset = null;
      let status = null;
      let totalScore = null;
      let data = { id:exam._id,name:exam.name ,users:[] }
      for(let i=0;i<users.length;i++){
        // Finding Matched Exam and setting status and score
        for(let j=0;j<users[i].exams.length;j++){
          // Checking Exam Id and User Exam Id
          if((users[i].exams[j].exam_id).equals(exam._id)){
            status = users[i].exams[j].attempted
            totalScore = users[i].exams[j].score.totalScore ?? null
            scoreToset = users[i].exams[j].score.finalScore ?? null
            break
          }
        }
        data.users.push({ id:users[i]._id, email: users[i].email, score:scoreToset, status:status })
      }
      data.totalScore = totalScore
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