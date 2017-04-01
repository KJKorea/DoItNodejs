// load modules
var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

var user = require('./routes/user');

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var database;
var UserModel;

// connect to database and add db object
function connectDB(){
  // connection info
  var databaseUrl = 'mongodb://localhost:27017/shopping';

  // connect to database
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function() {
    console.log('connected to database %s', databaseUrl);

    // create object of user schema and model
    createUserSchema();
  });

  database.on('disconnected', connectDB);
}

// create user schema and model object
function createUserSchema() {

  // call user_schema.js module
  UserSchema = require('./database/user_schema').createSchema(mongoose);

  // define UserModel
  UserModel = mongoose.model('users3', UserSchema);
  console.log('define UserMdoel');

  user.init(database, UserSchema, UserModel);

}

// create express server object
var app = express();

// set server variables and public folder static
app.set('port', process.env.PORT || 3000);
app.use('/public', express.static(path.join(__dirname, 'public')));

// set middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.post('/process/login', user.login);
app.post('/process/addUser', user.adduser);
app.post('/process/listuser', user.listuser);

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

http.createServer(app).listen(app.get('port'), function() {
  console.log('Started Express Server with port 3000');

  // connect to database
  connectDB();
});
