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
                "exams.$.attempted": true ,
                "exams.$.score": newScore
              }
            },
            { 
              new: true  
            }
          );  
        
        if(score){
            res.json({"message":"Scores Updated Successfully"})
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


module.exports = ScoreRouter