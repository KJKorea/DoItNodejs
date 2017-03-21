// load modules
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB() {
  var databaseUrl = 'mongodb://localhost:27017/shopping';

  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function() {
    console.log('');

    // create user schema and model
    createUserSchema();

    // test
    doTest();
  });
  database.on('disconnected', connectDB);
}

function createUserSchema() {
  // define schema
  // change password to hashed_password, add default property, salt property
  UserSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    name: {type: String, index: 'hashed', 'default': ''},
    age: {type: Number, 'default': -1},
    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
  });

  UserSchema
    .virtual('info')
    .set(function(info) {
      var splitted = info.split(' ');
      this.id = splitted[0];
      this.name = splitted[1];
      console.log('set virtual info: %s, %s', this.id, this.name);
    })
    .get(function() { 
      return this.id + ' ' + this.name
    });
  
  console.log('Define UserSchema');

  UserModel = mongoose.model('users4', UserSchema);
  console.log('Define UserModel');
}

function doTest() {
  // create instance of UserModel
  // set info property not id, name property
  var user = new UserModel({'info': 'test01 kei'});
  
  user.save(function(err) {
    if(err) throw err;

    console.log('add user data');

    findAll();
  });

  console.log('set info property');
  console.log('id: %s, name: %s', user.id, user.name);
}

function findAll() {
  UserModel.find({}, function(err, results) {
    if(err) throw err;

    if(results) {
      console.log('user doc object #0 -> id: %s, name: %s', results[0]._doc.id, results[0]._doc.name);
    }
  });
}

connectDB();
