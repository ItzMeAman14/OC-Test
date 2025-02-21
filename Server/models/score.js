const mongoose = require('mongoose');


// Score Schema
const scoreSchema = new mongoose.Schema({
  testCasesPassed: {
    type: Number,
    required: true, 
  },
  totalTestCases: {
    type: Number,
    required: true, 
  },
  timeTaken: {
    type: Number, 
    required: true, 
  },
  givenTime: {
    type: Number,
    required: true, 
  },
  numOfSubmissions: {
    type: Number,
    required: true, 
  },
  submissionTime:{
    type: Date,
    default: Date.now
  }
});


module.exports = scoreSchema
