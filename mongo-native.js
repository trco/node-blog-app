// Example of using native driver for MongoDB

// Declare dependencies
var mongo = require('mongodb');
// Define datebase host and port
var dbHost = '127.0.0.1';
var dbPort = 27017;

// Establish a database connection
var Db = mongo.Db;
var Connection = mongo.Connection;
var Server = mongo.Server;
var db = new Db ('test2', new Server(dbHost, dbPort), {safe: true});

// Create a database document
db.open(function (error, dbConnection) {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log('db.state: ', db._state);
  item = {
    name: 'Trco'
  }
  dbConnection.collection('messages').insert(item, function (error, item ) {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    // Output a newly created document/object
    console.info('created/inserted: ', item);
    db.close();
    process.exit(0);
  });
});
