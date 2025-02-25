const mongoose = require('mongoose');
const scoreSchema = require("./score");

// User Schema

const userScoreSchema = new mongoose.Schema({
  exam_id:{
      type:mongoose.Types.ObjectId
  },
  attempted:{
      type:Boolean,
      default:false
  },
  score:scoreSchema
})


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    blocked:{
        type:Boolean,
        default:false
    },
    pendingRequest:{
        type:Array
    },
    examScore:[userScoreSchema]
});


module.exports = userSchema
