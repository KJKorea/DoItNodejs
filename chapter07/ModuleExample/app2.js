// load modules
var express = require('express'), 
    http = require('http'), 
    path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

var config = require('./config');
var database = require('./database/database');
var route_loader = require('./routes/route_loader');

// create express server object
var app = express();

// set server variables and public folder static
console.log('config.server._port: %d', config.server_port);
app.set('port', config.server_port || 3000);
app.use('/public', express.static(path.join(__dirname, 'public')));

// set middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

route_loader.init(app, express.Router());

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
  database.init(app, config);
});
