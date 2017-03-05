var fs = require('fs');
fs.mkdir('./docs', 0666, function(err){
  console.log('created new docs folder');

  fs.rmdir('./docs', function(err){
    if(err) throw err;
    console.log('delete docs folder');
  });
});
