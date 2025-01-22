const mongoose = require("mongoose")

const connect = mongoose.connect("mongodb://localhost:27017/oc");

connect.then(() => {
    console.log("Database Connected SuccessFully.");
})
.catch((err) => {
    console.log("Database Connection Failed.");
    console.log(err);
})

const ExamSchema = new mongoose.Schema({
    name:{
        type:String
    },
    questions:{
        type:Array
    }   
});

const collection = new mongoose.model("exams",ExamSchema);

module.exports = collection