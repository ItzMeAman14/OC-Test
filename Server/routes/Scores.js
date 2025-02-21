const express = require("express")
const ScoreRouter = express.Router()
const mongoose = require("mongoose")
const { collection } = require("../config");


// Scores Router
ScoreRouter.get("/getScores/:id",async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const scores = await collection.find({ _id: objectId },{ score:1,_id:0});
        
        res.json(scores[0].score ? scores[0].score : "No Scores Found");
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }  
})


ScoreRouter.put("/setScores/:id",async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const exam = await collection.findByIdAndUpdate(
            { _id: objectId },
            { 
                $set: { 
                  "score.testCasesPassed": req.body.testCasesPassed,
                  "score.totalTestCases": req.body.totalTestCases,
                  "score.timeTaken": req.body.timeTaken,
                  "score.givenTime": req.body.givenTime,
                  "score.numOfSubmissions": req.body.numOfSubmissions 
                }
              },
              { new: true }
        )
            
        res.json({"message":"Scores Updated Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }  
})

module.exports = ScoreRouter