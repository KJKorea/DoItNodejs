process.on('exit', function(){
  console.log('emit event of exit');
});

setTimeout(function(){
  console.log('try to halt system after 2 seconds');
  process.exit();
}, 2000);
