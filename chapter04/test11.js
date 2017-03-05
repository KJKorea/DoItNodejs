var fs = require('fs');

fs.writeFile('./output11-1.txt', 'Hello World', function(err){
  if(err) throw err;
});

var infile = fs.createReadStream('./output11-1.txt', {flags: 'r'});
var outfile = fs.createWriteStream('./output11-2.txt', {flags: 'w'});

infile.on('data', function(data){
  console.log('data to read', data);
  outfile.write(data);
});

infile.on('end', function(){
  console.log('end to read');
  outfile.end(function(){
    console.log('end to write');
  });
});
