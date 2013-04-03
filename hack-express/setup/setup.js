var config = require('../config');
var fs = require('fs');
var path = require('path');
var async = require('async');

var nano = require('nano')(config.db.connection_string());

// Setup hack-express database.
nano.db.create(config.db.name, function(err, body) {
  if (!err) {
    console.log('Database ' + config.db.name + ' created!');
    db = nano.use(config.db.name);

    design_docs = fs.readdirSync('./design_docs/' + config.db.name);

    design_docs.forEach(function(design_doc) {
      var file = fs.readFileSync(path.join('./design_docs', config.db.name, design_doc));
      var design = JSON.parse(file, 'utf8');
      
      db.insert(design, function(error, response) {
        if (!error) {
          console.log('Successfully installed: ' + design_doc);
        } else {
          console.log('Error occurred installing: ' + design_doc);
          console.log('Error: ' + error.reason);
        }
      });
    });
  } else {
    console.log('Error: ' + err.reason);
  }
});

// Setup hack-express-sessions database.
// Create Session Store Database.
nano.db.create(config.session.db.name, function(err, body) {
  if (!err) {
    console.log('Database ' + config.session.db.name + ' created!');
    
    // Session Store Options.
    var opts = {
      name: config.session.db.name,
      revs_limit: config.session.db.revs_limit,
      username: config.session.db.username,
      password: config.session.db.password
    }

    module.paths.push(process.cwd() + '/../node_modules/connect-couchdb/node_modules');

    var connect = require('connect');
    var connect_couchdb = new (require('connect-couchdb')(connect))(opts);

    // Install hack-express-sessions database design documents.
    connect_couchdb.setup(opts, function (err) {
      if (err) {
        console.log('Error: ' + err.reason);
      }
      console.log('ok !');
    });
  
  } else {
    console.log('Error Creating hack-express-session: ' + err.reason);
  }
});