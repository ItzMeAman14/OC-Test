const mongoose = require('mongoose');


// Score Schema
const scoreSchema = new mongoose.Schema({
  totalScore:{
    type:Number
  },
  finalScore:{
    type:Number
  },
  testCasesPassed: {
    type: Number,
  },
  totalTestCases: {
    type: Number,
  },
  timeTaken: {
    type: Number, 
  },
  givenTime: {
    type: Number,
  },
  numOfSubmissions: {
    type: Number,
  },
  submissionTime:{
    type: Date,
    default: Date.now
  }
});


module.exports = scoreSchema
