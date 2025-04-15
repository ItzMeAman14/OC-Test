const mongoose = require('mongoose');

const LeaderBoardSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  users: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId
      },
      score: Number,
      email: String
    }
  ]
});

module.exports = LeaderBoardSchema
