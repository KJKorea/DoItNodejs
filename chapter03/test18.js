function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.walk = function(speed) {
    console.log('I walk in %d km', speed);
};

var person1 = new Person('andrew', 10);
var person2 = new Person('bewhy', 20);

console.log('we call walk(10) of %s', person1.name);
person1.walk(10);
