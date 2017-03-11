var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');

var app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/process/login', function(req, res) {
  console.log('processed response at first middleware');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Response from Express Server</h1>');
  res.write('<div><p>Param id:' + paramId + '</p></div>');
  res.write('<div><p>Param password:' + paramPassword + '</p></div>');
  res.write('<br><br><a href="/login2.html">Back to login</a>');
  res.end();
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
