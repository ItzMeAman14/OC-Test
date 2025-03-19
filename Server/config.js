const mongoose = require("mongoose")
const ExamSchema = require("./models/exam");
const MessageSchema = require("./models/messages");
const userSchema = require("./models/user");

const connect = mongoose.connect("mongodb://localhost:27017/oc");

connect.then(() => {
    console.log("Database Connected SuccessFully.");
})
.catch((err) => {
    console.log("Database Connection Failed.");
    console.error(err);
})

// Models
const messaging = new mongoose.model("messages",MessageSchema);
const collection = new mongoose.model("exams",ExamSchema);
const User = new mongoose.model("users",userSchema);

module.exports = { collection,messaging,User }