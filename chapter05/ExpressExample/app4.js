var express = require('express'), 
    http = require('http'), 
    path = require('path');

var app = express();

app.use(function(req, res, next) {
  console.log('processed response at first middleware');

  // res.send({name: 'girl', age: 20});
  // res.status(403).send('Forbidden');
  // res.sendStatus(403);
  // res.redirect('http://www.google.com');

  var userAgent = req.header('User-Agent');
  var paramName = req.query.name;
  
  res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Response from Express Server</h1>');
  res.write('<div><p>User-Agent:' + userAgent + '</p></div>');
  res.write('<div><p>Param Name:' + paramName + '</p></div>');
  res.end();
});

http.createServer(app).listen(3000, function() {
  console.log('Started Express Server with port 3000');
});
