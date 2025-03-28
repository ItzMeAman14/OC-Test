const mongoose = require("mongoose");
const scoreSchema = require("./score");

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
    questions:[QuestionSchema], 
    score: scoreSchema 
});

module.exports = ExamSchema;