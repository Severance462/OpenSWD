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

hbs.registerHelper('genAll', ()=>{
    var gen = ""
    gen = "<table>"
    gen += "<tbody>"

    employee.find(function(err, data){
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
    })

    gen += "</tbody>"
    gen += "</table>"
    return gen
})

hbs.registerHelper('oneEmp', (empId)=>{
    db.employee.find(function(err, data, empId){
        ObjectId(empId)
    })
    // if(err) throw err;
    // var query = {id: empId}

    // employee.find(query)
})

// employee.query.byID = function(id) {
//     return this.where({id: new RegExp(id, 'i')});
// };



app.all('/view', function(req, res, next) {    
    res.render('view.hbs', {gen: res.gen});    
})

app.all('/index', (req, res)=>{
    res.render('form.hbs');
})

app.all('/test', (req, res)=>{
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
