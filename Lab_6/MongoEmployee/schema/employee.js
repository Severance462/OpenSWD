//set up to provide database rules on data 

const mongoose = require("mongoose");

let employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    department: String,
    startDate: Date,
    jobTitle: String,
    salary: Number
});

// personSchema.methods.yell = function(){
// //can set up 
//     var greeting = "Hey, " + firstName + "!";
// }

module.exports = mongoose.model('Employee', employeeSchema);