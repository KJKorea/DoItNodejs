// load modules
var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

// load mysql module
var mysql = require('mysql');

// set mysql connection
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'test',
  port: '3307',
  debug: false
});

var addUser = function(id, name, age, password, callback) {
  console.log('called addUser()');

  pool.getConnection(function(err, conn) {
    if(err) {
      // must release
      conn.release();
      return;
    }
    console.log('thread id of database connection : %s', conn.threadId);

    // create object with data
    var data = {id: id, name: name, age: age, password: password}

    // execute sql statement
    var exec = conn.query('insert into users set ?', data, function(err, result) {
      conn.release();
      console.log('sql : %s', exec.sql);

      if(err) {
        console.log('occured error');
        console.dir(err);
        callback(err, null);
        return;
      }

      callback(null, result);
    });
  });
};

var authUser = function(id, password, callback) {
  console.log('called authUser()');

  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      return;
    }
    console.log('thread id of database connection: %s', conn.threadId);

    var colums = ['id', 'name', 'age'];
    var tablename = 'users';

    var exec = conn.query('select ?? from ?? where id = ? and password = ?', [colums, tablename, id, password], function(err, rows) {
      conn.release();
      console.log('sql: %s', exec.sql);

      if(rows.length > 0) {
        console.log('matched user - id [%s], password [%s]', id, password);
        callback(null, rows);
      } else {
        console.log('no user matched');
        callback(null, null);
      }
    });
  });
};

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

app.post('/process/adduser', function(req, res) {
  console.log('called /process/adduser');

  var paramId = req.body.id;
  var paramName = req.body.name;
  var paramAge = req.body.age;
  var paramPassword = req.body.password;

  if(pool) {
    addUser(paramId, paramName, paramAge, paramPassword, function(err, result) {
      if(err) throw err;

      if(result) {
        console.dir(result);
        console.log('inserted %d rows', result.affectedRows);

        var insertId = result.insertId;
        console.log('id of inserted record : ' + insertId);

        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>Added user successfully</h2>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>Failed to add user</h2>');
        res.end();
      }
    });
  } else {
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h2>Failed to connect database</h2>');
    res.end();
  }
});

app.post('/process/login', function(req, res) {
  console.log('called /process/login');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  if(pool) {
    authUser(paramId, paramPassword, function(err, rows) {
      if(err) throw err;

      if(rows) {
        console.log(rows);
        var username = rows[0].name;

        res.writeHead('200', {'Content-Type':'text/html; charset=utf8'});
        res.write('<h1>Login successfully</h1>');
        res.write('<div><p>ID: ' + paramId + '</p></div>');
        res.write('<div><p>Name: ' + username + '</p></div>');
        res.write('<br><br><a href="/public/login2.html"></a>');
        res.end();
      }
    });
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
});
