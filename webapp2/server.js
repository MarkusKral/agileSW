var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Receipe = require('./api/models/cookbook_model'), //created model loading her
  User = require('./api/models/user'); //created model loading here

var session = require('express-session');

var passport = require('passport')

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var flash    = require('connect-flash');
var database = 'cookbookTest';

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  database = 'cookbook'
}
var mongourl = 'mongodb://cookbook:12345678@localhost:27017/' + database;
mongoose.connect(mongourl);

require('./api/config/passport.js')(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//use sessions for tracking logins
app.use(session({
  secret: 'whatshallwedowiththedrunkensailor',
 // resave: true,
 // saveUninitialized: false,
  cookie: {
      maxAge: 1000 * 24 * 60
  }
}));




// required for passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// app.use(passport.initialize());
// app.use(passport.session());
//require('./app/routes.js')(app, passport);

var routes = require('./api/routes/cookbook_route'); //importing route
routes(app); //register the route


app.listen(port);
module.exports = app;

console.log('RESTful API server started on: ' + port);

