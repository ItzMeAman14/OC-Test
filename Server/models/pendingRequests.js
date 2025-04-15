const mongoose = require('mongoose');


// Pending Requests Schema
const pendingRequestsSchema = new mongoose.Schema({
  email:{
    type:String
  },
  password:{
    type:String
  },
  requestDate:{
    type: Date,
    default: Date.now
  }
});


module.exports = pendingRequestsSchema