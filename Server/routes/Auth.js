const express = require("express")
const authRouter = express.Router();
const { User } = require("../config");

// Routes
authRouter.post("/signup",async(req,res) => {
    try{
        const existUser = await User.find({email:req.body.email})
        
        if(existUser.length !== 0){
            return res.json({"message":"Account Already Exists"});
        }
        else{

            const user = new User({
                email:req.body.email,
                password:req.body.password
            })
            
            const admins = await User.find({role:"admin"});

            admins.forEach(async(admin) => {
                await User.updateOne(
                    { _id: admin._id },
                    { "$push": {
                        "pendingRequest": user
                    } }
                )
            })
            res.json({"message":"Request Sent to Admin"});
        }
    }
    catch(err){
        console.error(err);
        res.json({"message":"Some error Occured"})
    }
})

authRouter.post("/login",async(req,res) => {
    try{
        const user = await User.find({ email:req.body.email })
        
        if(user[0].blocked){
            return res.status(401).json({"message":"You are Blocked by the Admin."})
        }

        if(user.length === 0){
            res.status(404).json({"message":"User not Found"})
        }
        else{
            if(user[0].password === req.body.password){
                res.json({"message":"Logged in Successfully","uid":user[0]._id, "role":user[0].role});
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