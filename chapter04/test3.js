process.on('tick', function(count){
  console.log('emit event of tick : %s', count);
});

setTimeout(function(){
  console.log('try to delivery tick event after 2 seconds');

  process.emit('tick', '2');
}, 2000);
