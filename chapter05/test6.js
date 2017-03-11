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
  var infile = fs.createReadStream(filename, {flags: 'r'});
  var filelength = 0;
  var curlength = 0;

  fs.stat(filename, function(err, stats) {
    filelength = stats.size;
  });

  // write header
  res.writeHead(200, {"Content-Type": "image/png"});

  // write content form reading file
  infile.on('readable', function() {
    var chunk;
    while(null !== (chunk = infile.read())) {
      console.log('data size readed : %d Bytes', chunk.length);
      curlength += chunk.length;
      res.write(chunk, 'utf8', function(err) {
        console.log('complete to write file partly : %d, file size: %d', curlength, filelength);
        if(curlength >= filelength) {
          // send response
          res.end();
        }
      });
    }
  });

  // connect response with pipe()
  // infile.pipe(res);
});

// close event
server.on('close', function() {
  console.log('web server closed');
});
