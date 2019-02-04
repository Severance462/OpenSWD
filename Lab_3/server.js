//load express library
var express = require("express");
//load handlebars library
var hbs = require('hbs');
//express object
var app = express();
app.set('view engine', 'hbs');

app.use(express.urlencoded());
//including the partials folder
hbs.registerPartials(__dirname + '/views/partials')

hbs.registerHelper('today', ()=>{
    var date = new Date();
    return date;
});

hbs.registerHelper('error404',()=>{
    var divNum = Math.floor(Math.random() * 50) + 20;
    var gen;    
    gen = "<h1>It's not there, brah!</h1>";

    for(var i = 0; i < divNum; i++)
    {           
        var cl = "";
        var classNum = Math.floor(Math.random() * 3) + 1;
        if (classNum == 1)
        {
            cl = "shrink";
        }
        else if (classNum == 2)
        {
            cl = "rotate";
        }
        else 
        {
            cl = "still";
        }

        gen += "<div class='" + cl + "'>404</div>"
    }
    return gen;
})

hbs.registerHelper('ptag',(num, messagePassed)=>{
    var msg = '';
    for(let i = 0; i < num; i++){
        msg+=`<p>${messagePassed}</p><br>`;
    }
    //return msg;
    //need this safeString function if you have html elements in your string
    return new hbs.handlebars.SafeString(msg);
})

hbs.registerHelper('genGrid', (numba)=>{
    var  gen = "<table><tbody>";
    for(var i = 0; i < numba; i++)
    {
        var color = ((1<<24)*Math.random()|0).toString(16);                
        gen += "<tr>";
        for(var j = 0; j < numba; j++)
        {
            color = ((1<<24)*Math.random()|0).toString(16);                
            gen += "<td style='background-color:#" + color + "; width='200px'>" + color + "<br /> <span style='color:#ffffff'>" + color + "</span></td>"
            // gen += "<td style='border: 1px solid black; background-color:#" + color + "'><p style='text-align:center;'> " + color + " </p><p style='color:white; text-align:center;'>"+ color + "</p></td>";
        }
        gen += "</tr>";        
    }
    gen += "</tbody></table>";
    return gen;
});


app.post('/results', function(req, res, next) {    
    res.render('results.hbs', { numba: req.body.ddNumba });    
  });



//middleware example
//so when you go to the root directory '/', it will log out the date into the terminal console
app.use('/', (req, res, next)=>{
    //console.log(new Date());
    //needed in order to move on to the next function
    next();
})

//express middleware... __dirname referes to the directory
//so this points to the public folder which will contain css, images, etc
app.use(express.static(__dirname + '/public'));


app.all('/index', (req, res)=>{
    res.render('form.hbs');
});

app.all('/', (req, res)=>{
    res.render('form.hbs');
})

// app.use((req, res, next)=>{
//     const error = new Error('Page not found ya bum');
//     error.status = 404; 
//     next(error);
// });


app.get('*', (req, res)=>{
    res.render("error.hbs");
})


//listen for the server to start up and when it does, console.log the message the server is up
app.listen(3000, ()=>{
    console.log("Server is up at localhost:3000")
})
