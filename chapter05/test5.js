var http = require('http');
var fs = require('fs');

var server = http.createServer();

var port = 3000;
server.listen(port, function() {
  console.log('started web server : %d', port);
});

// connection event
server.on('connection', function(socket) {
  var addr = socket.address();
  console.log('client connected - %s:%d', addr.address, addr.port);
});

// request event
server.on('request', function(req, res) {
  console.log('client requested');
  // console.dir(req);

  var filename = 'house.png';
  fs.readFile(filename, function(err, data) {
    res.writeHead(200, {"Content-Type": "image/png"});
    res.write(data);
    res.end();
  });
});

// close event
server.on('close', function() {
  console.log('web server closed');
});
