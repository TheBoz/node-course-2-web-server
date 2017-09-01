const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Heroku will set this port env variable
const port = process.env.port || 3000;

var app = express();

// Register handlebar partials path
hbs.registerPartials(__dirname + '/views/partials');
// Set handlebars as express view engine
app.set('view engine', 'hbs');

// Set up maintenance middleware
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// Set up static public html route middleware
app.use(express.static(__dirname + '/public'));

// Register Express Middleware
app.use((req, res, next) => {
  var now = new Date().toString();

  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  // Must call next to finish this call
  next();
});


// Register HandleBar helpers
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Andrew',
  //   likes: [
  //     'biking',
  //     'country',
  //     'mountains'
  //   ]
  // });
  res.render('home.hbs', {
    pageTitle: 'About Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  // res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/projects', (req, res) => {
  // res.send('About Page');
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
    projectsMessage: 'Welcome to the Projects Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});


