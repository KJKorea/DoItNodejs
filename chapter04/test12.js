var fs = require('fs');

var inname = './output11-1.txt';
var outname = './output11-2.txt';

fs.exists(outname, function(exists){
  if(exists) {
    fs.unlink(outname, function(err){
      if(err) throw err;
      console.log('delete last file [%s]', outname);
    });
  }

  var infile = fs.createReadStream(inname, {flags: 'r'});
  var outfile = fs.createWriteStream(outname, {flags: 'w'});

  infile.pipe(outfile);
  console.log('copy file [%s] -> [%s]', inname, outname);
});

