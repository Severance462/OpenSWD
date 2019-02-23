//load express library
const express = require("express");
//load handlebars library
const hbs = require('hbs');
//express object
const app = express();
app.set('view engine', 'hbs');
const mongoose = require("mongoose");
const employee = require("./schema/employee.js");

const router = express.Router();

const moment = require('moment');

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

//  app.use('/employees', router);

// app.get('/view', (req, res)=>{
//     res.json({message: 'stuff'});
// })

app.get('/employees', function(req, res) {
    employee.find(function(err, employees){
        if(err)
            res.send(err)
        
            res.json(employees)
    })
})

// hbs.registerHelper('genEmps', (req, res)=>{
//     var promise = getEmps();  

//     promise.catch(function(error){
//         console.log(error);
//     })

//     promise.then(function(employee){
//         var gen = "<table class='table'><tbody>";
//         gen += "<thead><th scope='col'>First Name</th><th scope='col'>Last Name</th><th scope='col'>Department</th><th scope='col'>Start Date</th><th scope='col'>Job Title</th><th scope='col'>Salary</th></thead>";
//         employee.forEach(function(emp){          
//             gen += "<td>" + emp.firstName + "</td>";
//             gen += "<tr>"
//             gen += "<td>" + emp.firstName + "</td>" 
//             gen += "<td>" + emp.lastName + "</td>"
//             gen += "<td>" + emp.department+ "</td>"
//             gen += "<td>" + emp.startDate+ "</td>"
//             gen += "<td>" + emp.jobTitle + "</td>"
//             gen += "<td>" + emp.salary + "</td>"
//             gen += "<td>" + "<a class='btn btn-primary' href='update.hbs'>Update</a>" + "</td>"
//             gen += "<td>" + "<a class='btn btn-primary' href='delete.hbs'>Delete</a>" + "</td>"
//             gen += "</tr>"
//        });
//        gen += "</tbody></table>";       
       
//        return gen;  
//        //res.send(gen);
//     })
 
// })

function getEmps(){
    //var promise = employee.find().exec();
    var promise = employee.find(function(err, res, employees){
        if(err)
            res.send(err)
    }).exec();
    return promise;  
 }

//  app.get('/viewEmpsAll', async (req, res)=>{    
//     var promise = getEmps();  
//     var gen = "<table><tbody>";
//     promise.then(function(employee){
//        employee.forEach(function(emp){
//           console.log(emp.firstName);
//           gen += "<td>" + emp.firstName + "</td>";
//           gen += "<tr>"
//           gen += "<td>" + emp.firstName + "</td>" 
//           gen += "<td>" + emp.lastName + "</td>"
//           gen += "<td>" + emp.department+ "</td>"
//           gen += "<td>" + emp.startDate+ "</td>"
//           gen += "<td>" + emp.jobTitle + "</td>"
//           gen += "<td>" + emp.salary + "</td>"
//           gen += "<td>" + "<a class='btn btn-primary' href='update.hbs'>Update</a>" + "</td>"
//           gen += "<td>" + "<a class='btn btn-primary' href='delete.hbs'>Delete</a>" + "</td>"
//           gen += "</tr>"
//        });
//        gen += "</tbody></table>"
//        res.send(gen);
//     }).catch(function(error){
//        console.log(error);
//     });    
// })

app.get('/view', (req, res)=>{
    var promise = getEmps();  
    
    var gen = "<table class='table'><tbody>";
    promise.then(function(employee){
        gen += "<thead><th scope='col'>First Name</th><th scope='col'>Last Name</th><th scope='col'>Department</th><th scope='col'>Start Date</th><th scope='col'>Job Title</th><th scope='col'>Salary</th><th scope='col'></th><th scope='col'></th></thead>"; 
        employee.forEach(function(emp){
            var fomatted_date = moment(emp.startDate).format('MM--DD--YYYY');
            gen += "<tr>"
            gen += "<td>" + emp.firstName + "</td>" 
            gen += "<td>" + emp.lastName + "</td>"
            gen += "<td>" + emp.department + "</td>"
            gen += "<td>" + fomatted_date + "</td>"
            gen += "<td>" + emp.jobTitle + "</td>"
            gen += "<td>" + emp.salary + "</td>"
            gen += "<td>" + "<a class='btn btn-primary' href='update.hbs'>Update</a>" + "</td>"
            gen += "<td>" + "<a class='btn btn-primary' href='delete.hbs'>Delete</a>" + "</td>"
            gen += "</tr>"
       });
       gen += "</tbody></table>"

       res.render('view.hbs', {gen: gen});
    })
    
    promise.catch(function(error){
       console.log(error);
    });    
    
})    
 


// app.get('/viewAll', (req, res, employees)=>{    
//      var employees = employee.find(function(err, employees){
//          if(err)
//              res.send(err)                
//      })   
//     console.log(employees);
//     res.render('view.hbs', {emps: employees});
// })

app.post('/update', (req, res)=>{
    
    res.render('update.hbs', {empID: tId})
})

app.all('/index', (req, res)=>{
    res.render('form.hbs');
})

app.all('/test', (req, res, tId)=>{    
    res.render('test.hbs');
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
