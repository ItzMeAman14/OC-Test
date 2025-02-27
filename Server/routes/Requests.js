const express = require("express")
const RequestRouter = express.Router();
const mongoose = require("mongoose");
const { User, collection } = require("../config");

// Routes
RequestRouter.get("/getRequestedUsers",async(req,res) => {
    try{
        const requests = await User.find(
            { role:"admin" },
            { pendingRequest:1 ,_id:0})

        if(requests.length !== 0){
            return res.json(requests[0].pendingRequest)
        }
        else{
            return res.json({"message":"No Pending Requests"})
        }
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


RequestRouter.get("/acceptRequest/:id", async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);

        const requests = await User.aggregate([
            {
              $match: {
                role: "admin",
                "pendingRequest._id": objectId, 
              }
            },
            {
              $project: {
                pendingRequest: {
                  $filter: {
                    input: "$pendingRequest",
                    as: "request",
                    cond: { $eq: ["$$request._id", objectId] }
                  }
                },
                _id: 0
              }
            }
          ]);
          
        if(requests.length !== 0){
            const newUser = new User(requests[0].pendingRequest[0]);

            const exams = await collection.find({})
            let initialExamScore = [];
            exams.forEach((exam) => {
              initialExamScore.push({
                exam_id:exam._id,
                name: exam.name,
                attempted:false,
                score:{}
              })
            })

            newUser.examScore = initialExamScore;
            await newUser.save();

            const removeUser = await User.updateMany(
                { role: "admin" },
                { "$pull" : {
                    "pendingRequest": { _id: objectId }
                } }
            )
            res.json({"message":"Request Accepted Successfully"});
        }
        else{
            return res.json({"message":"No Pending Requests"})
        }
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

module.exports = RequestRouter;