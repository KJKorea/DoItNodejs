var Calc = require('./cal3');

var calc = new Calc();
calc.emit('stop');

console.log('delivery step event to %s', Calc.title);
