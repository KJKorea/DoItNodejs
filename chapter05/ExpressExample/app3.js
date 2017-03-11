var express = require('express'), 
    http = require('http'), 
    path = require('path');

var app = express();

app.use(function(req, res, next) {
  console.log('processed response at first middleware');

  req.user = 'mike';

  next();
});

app.use('/', function(req, res, next) {
  console.log('processed response at second middleware');

  res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
  res.end('<h1>Response from ' + req.user + ' at Express Server</h1>');
});

http.createServer(app).listen(3000, function() {
  console.log('Started Express Server with port 3000');
});
