//load express library
const express = require("express");
//load handlebars library
const hbs = require('hbs');
//express object
const app = express();
app.set('view engine', 'hbs');
const mongoose = require("mongoose");
const employee = require("./schema/employee.js");

app.use(express.urlencoded({extended:false}));

//including the partials folder
hbs.registerPartials(__dirname + '/views/partials')

mongoose.connect('mongodb://localhost:27017/Employee', {useNewUrlParser: true});

 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function(){
     console.log("We're connected!")
 });

hbs.registerHelper('ptag',(num, messagePassed)=>{
    var msg = '';
    for(let i = 0; i < num; i++){
        msg+=`<p>${messagePassed}</p><br>`;
    }
    //return msg;
    //need this safeString function if you have html elements in your string
    return new hbs.handlebars.SafeString(msg);
})

app.get('/view', function (req, res){
    employee.find(function(err, data){
        if (err) return console.error(err);        
        console.log(data);
        var gen = "<table>"
        gen += "<tbody>"
        
        for(var em in data){
            gen += "<td>" + data.firstName + "</td>"
        }
        gen += "</tbody>"
        gen += "</table>"
    })
    res.render('view.hbs', {gen: gen});    
});

app.post('/results', function(req, res, next) {    
    var emp = new employee({firstName: req.body.firstName, lastName: req.body.lastName, department: req.body.ddDepartment, startDate: req.body.startDate, jobTitle: req.body.jobTitle, salary: req.body.salary});
    emp.save(function(err, emp){
        if(err) return console.error(err);
        console.log("Employee " + emp + " Saved!");
    })
    res.render('view.hbs', {emp: emp});    
 })

 app.all('/index', (req, res)=>{
    res.render('form.hbs');
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
