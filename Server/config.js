const mongoose = require("mongoose")

const connect = mongoose.connect("mongodb://localhost:27017/oc");

connect.then(() => {
    console.log("Database Connected SuccessFully.");
})
.catch((err) => {
    console.log("Database Connection Failed.");
    console.log(err);
})

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
    questions:[QuestionSchema],  
});

const collection = new mongoose.model("exams",ExamSchema);

module.exports = collection