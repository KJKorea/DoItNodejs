var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

app.get('/process/users/:id', function(req, res) {
  // get token
  var paramId = req.params.id;

  console.log('processed /process/users and token %s', paramId);

  res.writeHead(200, {'Contetn-Type':'text/html;charset=utf8'});
  res.write('<h1>Response from Express Server</h1>');
  res.write('<div><p>Param id : ' + paramId + '</p></div>');
  res.end();
});

// check cookie
app.get('/process/showCookie', function(req, res) {
  console.log('called /process/showCookie');

  res.send(req.cookies);
});

// check name of cookie
app.get('/process/setUserCookie', function(req, res) {
  console.log('called /process/setUserCookie');

  // set cookie
  res.cookie('user', {
    id: 'mike',
    name: 'girl',
    authorized: true
  }); 
  // res.cookie('user', 1);
  
  res.redirect('/process/showCookie');
});

app.get('/process/product', function(req, res) {
  console.log('called /process/product');

  if(req.session.user) {
    res.redirect('/public/product.html');
  } else {
    res.redirect('/public/login2.html');
  }
});

app.post('/process/login', function(req, res) {
  console.log('called /process/login');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  if(req.session.user) {
    // logged in
    console.log('already logged in and move product page');

    res.redirect('/public/product.html');
  } else {
    // save session
    req.session.user = {
      id: paramId,
      name: 'girl',
      authorized: true
    };

    res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Logged in successfully</h1>');
    res.write('<div><p>Param id: ' + paramId + '</p></div>');
    res.write('<div><p>Param password: ' +paramPassword + '</p></div>');
    res.write('<br><br><a href="/public/product.html">Move to product page</a>');
    res.end();
  }
});

app.get('/process/logout', function(req, res) {
  console.log('called /process/logout');

  if(req.session.user) {
    // logged in
    console.log('Logged out');

    req.session.destroy(function(err) {
      if(err) throw err;

      console.log('Destroyed session and logged out');
      res.redirect('/public/login2.html');
    });
  } else {
    // logged out
    console.log('Not logged in');

    res.redirect('/public/login2.html');
  }
});

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

http.createServer(app).listen(3000, function() {
  console.log('Started Express Server with port 3000');
});
