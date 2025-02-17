const express = require("express")
const msgRouter = express.Router();
const { messaging } = require("../config");

// Routes
msgRouter.get("/messages",async(req,res) => {
    const data = await messaging.find({});
    res.json(data);
})

msgRouter.post("/new", async(req,res) => {
    try{
        const msg = new messaging(req.body);
        msg.save();
        res.json({"message":"Message sent Successfully"})
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some Error Occured"})
    }
    
})


module.exports = msgRouter;