var database;
var UserSchema;
var UserModel;

// initialize database, schema, model
var init = function(db, schema, model) {
  console.log('object initialized');

  database = db;
  UserSchema = schema;
  UserModel = model;
};

// authenticate user
var authUser = function(database, id, password, callback) {
  console.log('called authUser()');

  // 1. search by id
  UserModel.findById(id, function(err, results) {
    if(err) {
      callback(err, null);
      return;
    }

    console.log('result of search - id: %s, password: %s', id, password);
    console.log(results);

    if(results.length > 0) {
      console.log('searched id');

      var user = new UserModel({id: id});
      var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);

      if(authenticated) {
        console.log('matched password');
        callback(null, results);
      } else {
        console.log('did not match password');
        callback(null, null);
      }

    } else {
      console.log('did not search');
      callback(null, null);
    }
  });
};

// add user
var addUser = function(database, id, password, name, callback) {
  console.log('called addUser()');

  // create instance of UserModel
  var user = new UserModel({"id": id, "password": password, "name": name});

  // save 
  user.save(function(err) {
    if(err) {
      callback(err, null);
      return;
    }

    console.log('Added user');
    callback(null, user);
  });
};

var login = function(req, res) {
  console.log('called /process/login in user module');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  if(database) {
    authUser(database, paramId, paramPassword, function(err, docs) {
      if(err) throw err;

      if(docs) {
        console.dir(docs);

        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h1>Login successfully</h1>');
        res.write('<div><p>id: ' + paramId + '</p></div>');
        res.write('<div><p>name:' + docs[0].name + '</p></div>');
        res.write('<br><br><a href="/public/login.html">Login again</a>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h1>Failed to login</h1>');
        res.write('<div><p>check your id or password</p></div>');
        res.write('<br><br><a href="/public/login.html">Login again</a>');
        res.end();
      }
    });
  } else {
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h2>failed to connect to database</h2>');
    res.write('<div><p>Cannot connect to database</p></div>');
    res.end();
  }
};

var adduser = function(req, res) {
  console.log('called /process/addUser in user module');

  var paramId = req.body.id;
  var paramPassword = req.body.password;
  var paramName = req.body.name;

  if(database) {
    addUser(database, paramId, paramPassword, paramName, function(err, result) {
      if(err) throw err;

      if(result) {
        console.dir(result);

        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>Added user successfully</h2>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>Failed to add user</h2>');
        res.end();
      }
    })
  } else {
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h2>failed to connect to database</h2>');
    res.end();
  }

};

var listuser = function(req, res){
  console.log('called /process/listuser in user module');

  if(database) {
    UserModel.findAll(function(err, results) {
      if(err) {
        callback(err, null);
        return;
      }

      if(results) {
        console.dir(results);

        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>List of user</h2>');
        res.write('<div><ul>');

        for(var i=0; i<results.length; i++) {
          var curId = results[i]._doc.id;
          var curName = results[i]._doc.name;
          res.write(' <li>#' + i + ' : ' +  curId + ', ' + curName + '</li>');
        }

        res.write('</ul></div>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>Failed to list user</h2>');
      }
    });
  }
};

module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;