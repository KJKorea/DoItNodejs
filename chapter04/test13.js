var fs = require('fs');
var http = require('http');

fs.writeFile('./output13.txt', 'Hello stream', function(err){
  if(err) throw err;
});

var server = http.createServer(function(req, res){
  // read file and merge response with pipe()
  var instream = fs.createReadStream('./output13.txt');
  instream.pipe(res);
});

server.listen(7001, '127.0.0.1');
