// require() method returns exports object
var user1 = require('./user1');

function showUser() {
  return user1.getUser().name + ', ' + user1.group.name;
}

console.log('user\'s info : %s', showUser());