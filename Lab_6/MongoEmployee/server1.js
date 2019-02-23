//load express library
const express = require("express");
//load handlebars library
const hbs = require('hbs');
//express object
const app = express();
app.set('view engine', 'hbs');
const mongoose = require("mongoose");
const employee = require("./schema/employee.js");

var tId = "5c707d4a54f5fb24e4436118";


app.use(express.urlencoded({extended:false}));

//including the partials folder
hbs.registerPartials(__dirname + '/views/partials')

mongoose.connect('mongodb://localhost:27017/Employee', {useNewUrlParser: true});

 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function(){
     console.log("We're connected!")
 });



hbs.registerHelper('genAll', (data)=>{
   
    var gen = ""
    gen = "<table>"
    gen += "<tbody>"
    
        if (err) return console.error(err);                        
        for(i = 0; i < data.length; i++){
            gen += "<tr>"
            gen += "<td>" + data[i].firstName + "</td>" 
            gen += "<td>" + data[i].lastName + "</td>"
            gen += "<td>" + data[i].department+ "</td>"
            gen += "<td>" + data[i].startDate+ "</td>"
            gen += "<td>" + data[i].jobTitle + "</td>"
            gen += "<td>" + data[i].salary + "</td>"
            gen += "<td>" + "<a class='btn btn-primary' href='update.hbs'>Update</a>" + "</td>"
            gen += "<td>" + "<a class='btn btn-primary' href='delete.hbs'>Delete</a>" + "</td>"
            gen += "</tr>"
        }

    console.log("1:" + gen)        
    gen += "</tbody>"
    gen += "</table>"

    return gen 
})

hbs.registerHelper('oneEmp', (err, tId)=>{
    // db.employee.find(function(err, data, tId ){
    //     ObjectId(tId)
    //})
    //var {age, name} = person;   <--object destructuring..creates 2 variables (name, age) from a person object
    if(err) throw err;
    var query = {id: tId}

    var oneEmp = employee.find(query)

    var str = "id: " + tId
    str += "<tr>"
    str += "<td>" + oneEmp.firstName + "</td>"
    str += "<td>" + oneEmp.lastName + "</td>"
    str += "<td>" + oneEmp.department+ "</td>"
    str += "<td>" + oneEmp.startDate+ "</td>"
    str += "<td>" + oneEmp.jobTitle + "</td>"
    str += "<td>" + oneEmp.salary + "</td>"
    //str += "<td>" + "<a class='btn btn-primary' href='update.hbs'>Update</a>" + "</td>"
    //str += "<td>" + "<a class='btn btn-primary' href='delete.hbs'>Delete</a>" + "</td>"
    str += "</tr>"

    return str
})

// employee.query.byID = function(id) {
//     return this.where({id: new RegExp(id, 'i')});
// };

// app.post('/view', function(req, res, next) {    
//     var emp = new employee({firstName: req.body.firstName, lastName: req.body.lastName, department: req.body.ddDepartment, startDate: req.body.startDate, jobTitle: req.body.jobTitle, salary: req.body.salary});
//     emp.save(function(err, emp){
//         if(err) return console.error(err);
//         console.log("Employee " + emp + " Saved!");
//     })
//     res.render('view.hbs', {emp: emp});    
//  })

app.all('/view', function(req, res, next, data) {   
    employee.find(function(err,data){
        if(err) return console.error(err)
    })
    res.render('view.hbs', {data: res.data});    
})

app.all('/index', (req, res)=>{
    res.render('form.hbs');
})

app.all('/test', (req, res, tId)=>{    
    res.render('test.hbs');
})


app.all('/form', (req, res)=>{
    res.render('form.hbs');
})
app.all('/', (req, res)=>{
    res.render('form.hbs');
})

app.get('*', (req, res)=>{
    res.render("error.hbs");
})

//listen for the server to start up and when it does, console.log the message the server is up
app.listen(3000, ()=>{
    console.log("Server is up at localhost:3000")
})
