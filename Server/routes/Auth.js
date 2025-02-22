const express = require("express")
const authRouter = express.Router();
const { User } = require("../config");

// Routes
authRouter.post("/signup",async(req,res) => {
    try{
        const user = new User({
            email:req.body.email,
            password:req.body.password
        })
        await user.save();
        res.json({"message":"User Registered Successfully"});
    }
    catch(err){
        console.error("Some error Occured");
        res.json({"message":"Some error Occured"})
    }
})

authRouter.post("/login",async(req,res) => {
    try{
        const user = await User.find({ email:req.body.email })
        
        if(user.length === 0){
            res.status(404).json({"message":"User not Found"})
        }
        else{
            if(user[0].password === req.body.password){
                res.json({"message":"Logged in Successfully","uid":user[0]._id});
            }
            else{
                res.status(400).json({"message":"Wrong Password.Try Again"});
            }
        }
    }
    catch(err){
        console.error("Some error Occured");
        res.status(500).json({"message":"Some error Occured"})
    }
})


module.exports = authRouter;