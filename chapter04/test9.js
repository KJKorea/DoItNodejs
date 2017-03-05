var fs = require('fs');

// read data from file 
fs.open('./output8.txt', 'r', function(err, fd){
  if(err) throw err;

  var buf = new Buffer(10);
  console.log('buffer type : %s', Buffer.isBuffer(buf));

  fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead, buffer){
    if(err) throw err;

    var inStr = buffer.toString('utf8', 0, bytesRead);
    console.log('data in file : %s', inStr);

    console.log(err, bytesRead, buffer);

    fs.close(fd, function(){
      console.log('complete to open and read output8.txt');
    });
  });
});
