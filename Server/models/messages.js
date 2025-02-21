const mongoose = require("mongoose")


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

module.exports = MessageSchema