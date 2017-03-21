// understand how to process require() 
var require = function(path) {
  var exports = {
    getUser: function(){
      return {id: 'test01', name: 'kei'};
    },
    group: {id: 'group01', name: 'friend'}
  }
  return exports;
}

var user = require('...');

function showUser() {
  return user.getUser().name + ', ' + user.group.name;
}

console.log('user\' info : %s', showUser());
