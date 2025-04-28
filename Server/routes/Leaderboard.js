const express = require("express")
const LeaderboardRoutes = express.Router()
const mongoose = require("mongoose")
const { leaderboard } = require("../config");

const sortLeaderboard = (exams) => {
    const sortedExams = exams.sort((a, b) => b.score - a.score);
    return sortedExams;
}

LeaderboardRoutes.get("/getLeaderboard/:id",async(req,res) => {
    try {
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const exams = await leaderboard.find({examId:examId}, { users: 1, _id: 0 });
        const users = sortLeaderboard(exams[0].users)
        res.status(200).json(users);
      } 
      catch (err) {
        res.status(500).json({ message: 'Internal Server Error'});
      }
})


LeaderboardRoutes.put("/updateScore/:id",async(req,res) => {
    try{
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const examId = new mongoose.Types.ObjectId(req.query.exam_id);

        const user = await leaderboard.updateOne(
            { examId: examId, "users.id": userId },
            { "$set": {
                "users.$.score": req.body.newScore
            } }
        )

        const exams = await leaderboard.find({examId:examId}, { users: 1, _id: 0 });
        
        const users = sortLeaderboard(exams[0].users)
        res.status(200).json(users);

    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})


LeaderboardRoutes.put("/addUserInLeaderboard/:id",async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.body.id);

        const exam = await leaderboard.findOne({examId:examId});
        
        if(!exam){
            const NewExamLeaderboard =  new leaderboard({
                examId:examId,
                users:[{
                    id:userId,
                    email: req.body.email,
                    score:0
                }]
            })

            const exams = await NewExamLeaderboard.save();
            const users = sortLeaderboard(exams.users);
            res.status(200).json(users);
        }
        else{

            
            const user = await leaderboard.updateOne(
            { 
                examId: examId, 
                "users.id": { $ne: userId }
            },
            { 
                "$push": {
                    "users": {
                        id: userId,
                        email: req.body.email,
                        score: 0
                    }
                }
            }
        );
            const exams = await leaderboard.find({examId:examId}, { users: 1, _id: 0 })
            const users = sortLeaderboard(exams[0].users)
            res.status(200).json(users);
        }

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Internal Server Error"})
    }
})


LeaderboardRoutes.put("/removeUserInLeaderboard/:id",async(req,res) => {
    try{
        const examId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.body.id);

        const user = await leaderboard.updateOne(
            { examId: examId },
            {
                "$pull": {
                "users": { id: userId }
                }
            }
        );

        const exams = await leaderboard.find({examId:examId}, { users: 1, _id: 0 })
        
        const users = sortLeaderboard(exams[0].users)
        res.status(200).json(users);

    }
    catch(err){
        console.error(err)
        res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports = LeaderboardRoutes