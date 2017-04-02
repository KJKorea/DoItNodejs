var mongodb = require('mongodb');
var mongoose = require('mongoose');

// add db, schema, model to databse object
var database = {};

database.init = function(app, config) {
  console.log('called init()');

  connect(app, config);
};

// connect database and add db object as property of response object
function connect(app, config) {
  console.log('called connect()');

  // connect to database
  mongoose.connect(config.db_url);
  database = mongoose.connection;

  database.on('error', console.error.bind(console, 'mongoose connection error.'));
  database.on('open', function() {
    console.log('connected to database %s', config.db_url);

    // create object of user schema and model
    createSchema(app, config);
  });

  database.on('disconnected', connect);
}

// create defined schema and model object in config
function createSchema(app, config) {
  var schemalen = config.db_schemas.length;
  console.log('number of defined schema in config : %d', schemalen);

  for(var i=0; i<schemalen ; i++) {
    var curItem = config.db_schemas[i];

    var curSchema = require(curItem.file).createSchema(mongoose);
    console.log('define schema after calling %s module', curItem.file);

    var curModel = mongoose.model(curItem.collection, curSchema);
    console.log('define model for %s collection', curItem.collection);

    database[curItem.schemaName] = curSchema;
    database[curItem.modelName] = curModel;
    console.log('add schema name : %s, model name : %s as property of database object', curItem.schemaName, curItem.modelName);
  }
  app.set('database', database);
  console.log('add database object as property of app object');
}

module.exports = database;
