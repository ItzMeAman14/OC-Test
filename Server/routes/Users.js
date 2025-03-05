const express = require("express")
const UserRouter = express.Router();
const mongoose = require("mongoose");
const { User } = require("../config");
const authenticateToken = require("../middleware/auth");

UserRouter.use(authenticateToken)

// Routes
UserRouter.get("/users",async(req,res) => {
    try{
        const users = await User.find({role:"user"});
        res.json(users);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

UserRouter.get("/getUser",async(req,res) => {
    try{
        const requests = await User.find(
            {role:"admin", "pendingRequest.email": req.query.email }, 
            { pendingRequest:1 ,_id:0})

        if(requests.length !== 0){
            return res.json({"request":true})
        }

        const user = await User.find({email:req.query.email});

        if(user.length === 0){
            res.json({"message":"No User Found"});
        }
        else{
            res.json({id:user[0]._id});
        }
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

UserRouter.put("/giveAccess/:id", async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const user = await User.find({_id: objectId });

        const userAccess = user[0].role === "admin" ? "user" : "admin";

        const users = await User.updateOne(
            { _id: objectId },
            { "$set": {
                role: userAccess
            } }
        );
        res.json(users);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


UserRouter.put("/blockUser/:id",async(req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const user = await User.find({_id: objectId });

        const userBlockStatus = user[0].blocked ? false : true;

        const users = await User.updateOne(
            { _id: objectId },
            { "$set": {
                blocked: userBlockStatus
            } }
        );
        res.json({"message":"Status Updated SuccessFully"});
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})


UserRouter.get("/userExams/:id", async (req,res) => {
    try{
        const objectId = new mongoose.Types.ObjectId(req.params.id);
        const user = await User.find({_id: objectId });

        res.json(user[0].exams);
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
})

module.exports = UserRouter;