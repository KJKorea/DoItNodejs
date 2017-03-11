var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  console.log('processed response at first middleware');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Response from Express Server</h1>');
  res.write('<div><p>Param id:' + paramId + '</p></div>');
  res.write('<div><p>Param password:' + paramPassword + '</p></div>');
  res.end();
});

http.createServer(app).listen(3000, function() {
  console.log('Started Express Server with port 3000');
});
