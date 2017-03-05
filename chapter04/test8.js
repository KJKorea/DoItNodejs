var fs = require('fs');

// write data to file
fs.open('./output8.txt', 'w', function(err, fd){
  if(err) throw err;
  console.dir(fd);

  var buf = new Buffer('Hi!\n');
  fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer){
    if(err) throw err;

    console.log(err, written, buffer);
    console.dir(fd);

    fs.close(fd, function(){
      console.log('complete to open and write data');
    });
  });
});
