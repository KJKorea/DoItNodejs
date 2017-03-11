var http = require('http');

var server = http.createServer(function(req, res) {
  console.log('client requested');
  // console.dir(req);

  res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
  res.write("<!DOCUMENT html>");
  res.write("<html>");
  res.write(" <head>");
  res.write("   <title>Response</title>");
  res.write(" </head>");
  res.write(" <body>");
  res.write("   <h1>Response page from nodejs : callback</h1>");
  res.write(" </body>");
  res.write("</html>");
  res.end();
});

var port = 3000;
server.listen(port, function() {
  console.log('started web server : %d', port);
});

// connection event
server.on('connection', function(socket) {
  var addr = socket.address();
  console.log('client connected - %s:%d', addr.address, addr.port);
});

// close event
server.on('close', function() {
  console.log('web server closed');
});
