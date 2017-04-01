var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
  var UserSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true, 'default': ''},
    hashed_password: {type: String, required: true, default: ''},
    salt: {type: String, required: true},
    name: {type: String, index: 'hashed', default: ''},
    age: {type: Number, 'default': -1},
    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
  });

  UserSchema.static('findById', function(id, callback) {
    return this.find({id: id}, callback);
  });

  UserSchema.static('findAll', function(callback) {
    return this.find({ }, callback);
  });

  // define password as virtual method
  UserSchema
    .virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
      console.log('called virtual password : ' + this.hashed_password);
    })
    .get(function() {
      return this._password;
    });

  // encrypt password
  UserSchema.method('encryptPassword', function(plainText, inSalt) {
    if(inSalt) {
      return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
    } else {
      return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
    }
  });

  // make salt 
  UserSchema.method('makeSalt', function() {
    return Math.round(new Date().valueOf()*Math.random()) + '';
  });

  // authenticate
  UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
    if(inSalt) {
      console.log('called authenticate() : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
      return this.encryptPassword(plainText, inSalt) === hashed_password;
    } else {
      cnosole.log('called authenticate() : %s -> %s : %s', plainText, this.encryptPassword(plainText), hashed_password);
      return this.encryptPassword(plainText) === hashed_password;
    }
  });

  UserSchema.path('id').validate(function(id) {
    return id.length;
  }, 'no value in id');

  UserSchema.path('name').validate(function(name) {
    return name.length;
  }, 'no value in name');

  console.log('define UserSchema');

  return UserSchema;
};

// 
module.exports = Schema;