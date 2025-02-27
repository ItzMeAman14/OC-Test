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
            { _id:userId, "examScore.exam_id": examId },
            { "examScore.score":1,_id:0});
        
        if(scores){
            res.json(scores[0].examScore[0].score);
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
        const score = await User.findByIdAndUpdate(
            { _id: userId },
            { 
                "$push":{
                    "examScore":{
                        exam_id:examId,
                        attempted:true,
                        score:newScore
                    }
                }    
            },
            { new: true }
        )
            
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