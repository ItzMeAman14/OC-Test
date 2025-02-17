const mongoose = require("mongoose")

const connect = mongoose.connect("mongodb://localhost:27017/oc");

connect.then(() => {
    console.log("Database Connected SuccessFully.");
})
.catch((err) => {
    console.log("Database Connection Failed.");
    console.log(err);
})

// Exam Schema
const TestCaseSchema = new mongoose.Schema({
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
})


const QuestionSchema = new mongoose.Schema({
    heading:String,
    statement: String,
    id: mongoose.Schema.Types.ObjectId,
    testcases: [TestCaseSchema],
})

const ExamSchema = new mongoose.Schema({
    name:String,
    attempted: {
        type:Boolean,
        default:false
    },
    questions:[QuestionSchema],  
});


// Messages Schema

const MessageSchema = mongoose.Schema({
    msg: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
})

const messaging = new mongoose.model("messages",MessageSchema);
const collection = new mongoose.model("exams",ExamSchema);

module.exports = { collection,messaging }