var http = require('http');

// create web server object
var server = http.createServer();

// start web server with port 3000
// var port = 3000;
// server.listen(port, function() {
//   console.log('started server : %d', port);
// });

var host = '192.168.0.5';
var port = 3000;
server.listen(port, host, '50000', function() {
  console.log('started web server - %s:%d', host, port);
});
