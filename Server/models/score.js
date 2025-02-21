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
  avgTime: {
    type: Number,
    required: true, 
  },
  numOfSubmissions: {
    type: Number,
    required: true, 
  },
}, { timestamps: true });


module.exports = scoreSchema
