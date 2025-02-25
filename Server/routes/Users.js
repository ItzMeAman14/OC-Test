const express = require("express")
const UserRouter = express.Router();
const mongoose = require("mongoose");
const { User } = require("../config");

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

module.exports = UserRouter;