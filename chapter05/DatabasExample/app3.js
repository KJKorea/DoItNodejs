// load modules
var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var database;
var UserSchema;
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

    // define schema
    UserSchema = mongoose.Schema({
      id: String,
      name: String,
      password: String
    });

    console.log('define UserSchema');

    // define user model
    UserModel = mongoose.model('users', UserSchema);
    console.log('define UserModel');
  });

  database.on('disconnected', connectDB);

  // mongodb.connect(databaseUrl, function(err, db) {
  //   if(err) throw err;

  //   console.log('connected to database %s', databaseUrl);

  //   // set database variables
  //   database = db;
  // });
}

// authenticate user
var authUser = function(database, id, password, callback) {
  console.log('called authUser()');

  UserModel.find({"id": id, "password": password}, function(err, results) {
    if(err) {
      callback(err, null);
      return;
    }

    console.log('result of search - id: %s, password: %s', id, password);
    console.log(results);

    if(docs.length > 0) {
      console.log('searched users - id: %s, password: %s', id, password);
      callback(null, docs);
    } else {
      console.log('did not search');
      callback(null, null);
    }
  });
}

// add user
var addUser = function(database, id, password, name, callback) {
  console.log('called addUser()');

  // create instance of UserModel
  var user = new UserModel({"id": id, "password": password, "name": name});

  // save 
  user.save(function(err) {
    if(err) {
      callback(err, null);
      return;
    }

    console.log('Added user');
    callback(null, user);
  });
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

app.post('/process/login', function(req, res) {
  console.log('called /process/login');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  if(database) {
    authUser(database, paramId, paramPassword, function(err, docs) {
      if(err) throw err;

      if(docs) {
        console.dir(docs);

        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h1>Login successfully</h1>');
        res.write('<div><p>id: ' + paramId + '</p></div>');
        res.write('<div><p>name:' + docs[0].name + '</p></div>');
        res.write('<br><br><a href="/public/login.html">Login again</a>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h1>Failed to login</h1>');
        res.write('<div><p>check your id or password</p></div>');
        res.write('<br><br><a href="/public/login.html">Login again</a>');
        res.end();
      }
    })
  } else {
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h2>failed to connect to database</h2>');
    res.write('<div><p>Cannot connect to database</p></div>');
    res.end();
  }
});

app.post('/process/addUser', function(req, res) {
  console.log('called /process/addUser');

  var paramId = req.body.id;
  var paramPassword = req.body.password;
  var paramName = req.body.name;

  if(database) {
    addUser(database, paramId, paramPassword, paramName, function(err, result) {
      if(err) throw err;

      if(result) {
        console.dir(result);

        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>Added user successfully</h2>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>Failed to add user</h2>');
        res.end();
      }
    })
  } else {
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h2>failed to connect to database</h2>');
    res.end();
  }

});

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
