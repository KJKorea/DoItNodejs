var fs = require('fs');

// write file
fs.writeFile('./output7.txt', 'Hello World!', function(err){
  if(err){
    console.log('Error : %s', err);
  }

  console.log('complete to write at output.txt');
});
