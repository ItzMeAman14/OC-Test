const mongoose = require("mongoose")
const ExamSchema = require("./models/exam");
const MessageSchema = require("./models/messages");
const userSchema = require("./models/user");
const pendingRequestsSchema = require('./models/pendingRequests');
const LeaderBoardSchema = require("./models/Leaderboard");

require("dotenv").config()

const connect = mongoose.connect(process.env.MONGO_URL);

connect.then(() => {
    console.log("Database Connected SuccessFully.");
})
.catch((err) => {
    console.log("Database Connection Failed.");
})

// Models
const messaging = new mongoose.model("messages",MessageSchema);
const collection = new mongoose.model("exams",ExamSchema);
const User = new mongoose.model("users",userSchema);
const pendingUsers = mongoose.model('pendingUsers', pendingRequestsSchema)
const leaderboard = mongoose.model('leaderboard', LeaderBoardSchema)

module.exports = { collection, messaging, User, pendingUsers, leaderboard }