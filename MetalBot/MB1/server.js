//load express library
const express = require("express");
//load handlebars library
const hbs = require('hbs');
//express object
const app = express();
app.set('view engine', 'hbs');
const mongoose = require("mongoose");
const employee = require("./schema/employee.js");

const router = express.Router({mergeParams: true});

const moment = require('moment');

app.use(express.urlencoded({extended:false}));

//including the partials folderf
hbs.registerPartials(__dirname + '/views/partials')

mongoose.connect('mongodb://localhost:27017/Employee', {useNewUrlParser: true});

 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function(){
     console.log("We're connected!")
 });


 router.get('/random', (req, res, next) => {
    Band.count()
      .then((count) => {
        const randomIndex = Math.floor(Math.random() * count);
        return Band.findOne().skip(randomIndex);
      })
      .then((result) => {
        const bandID = result.band_id;
        return Scraper.getBand(bandID);
      })
      .then(band => res.status(200).json({ success: true, data: { band } }))
      .catch(err => next(err));
  });

  
 /*get json list of 20 bands*/
app.get('/', (req, res, next) => {
  const {
    genre, country, name,
  } = req.query;
  let { start, length } = req.query;
  const queryConditions = {};
  let totalResult = 0;

  if (name) {
    const nameRegex = Utils.makeSearchRegex(name);
    if (nameRegex) {
      queryConditions.band_name = nameRegex;
    } else {
      return next(Utils.sendError(400, 'Bad input (name) parameter.'));
    }
  }

  if (genre) {
    const genreRegex = Utils.makeSearchRegex(genre);
    if (genreRegex) {
      queryConditions.band_genre = genreRegex;
    } else {
      return next(Utils.sendError(400, 'Bad input (genre) parameter.'));
    }
  }

  if (country) {
    const countryRegex = Utils.makeSearchRegex(country);
    if (countryRegex) {
      queryConditions.band_country = countryRegex;
    } else {
      return next(Utils.sendError(400, 'Bad input (country) parameter.'));
    }
  }

  if (start && Number.isInteger(parseInt(start, 10))) {
    start = parseInt(start, 10);
  } else start = 0;

  if (length && Number.isInteger(parseInt(length, 10))) {
    length = (parseInt(length, 10) > 20 || parseInt(length, 10) <= 0) ? 20 : parseInt(length, 10);
  } else length = 20;

  return Band.count(queryConditions)
    .then((result) => {
      totalResult = result;
      if (totalResult === 0) {
        throw Utils.sendError(404, 'No match for query.', next);
      }
      if (start < 0 || start >= totalResult) {
        throw Utils.sendError(400, 'Bad start index.', next);
      }
      return Band.find(queryConditions).limit(length).skip(start);
    })
    .then((result) => {
      const currentResult = result.length;
      const bands = result.map((item) => {
        const band = {
          band_id: item.band_id,
          band_name: item.band_name,
          band_genre: item.band_genre,
          band_country: item.band_country,
        };
        return band;
      });
      res.status(200).json({ success: true, data: { totalResult, currentResult, bands } });
    })
    .catch(err => next(err));
});


// app.all('/', (req, res)=>{
//     res.render('index.hbs');
// })

app.get('*', (req, res)=>{
    res.render("error.hbs");
})

//listen for the server to start up and when it does, console.log the message the server is up
app.listen(3000, ()=>{
    console.log("Metal is up at localhost:3000")
})