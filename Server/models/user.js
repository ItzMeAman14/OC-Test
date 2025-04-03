const mongoose = require('mongoose');
const scoreSchema = require("./score");

// User Schema

const TestCaseSchema = new mongoose.Schema({
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
})


const UserQuestionSchema = new mongoose.Schema({
    passed:{
        type:Boolean,
        default:false
    },
    ques_id: {
        type:mongoose.Schema.Types.ObjectId
    },
    testcases: [TestCaseSchema],
})


const userExamSchema = new mongoose.Schema({
  exam_id:{
      type:mongoose.Types.ObjectId
  },
  name:{
    type:String
  },
  attempted: {
    type: String,
    enum: ['pending', 'true', 'false'],
    default: 'false'
  },
  questions:[UserQuestionSchema],
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
    exams:[userExamSchema]
});


module.exports = userSchema
