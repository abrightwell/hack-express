var config = require('../config');
var fs = require('fs');
var path = require('path');

var nano = require('nano')(config.db.user+':'+config.db.password+'@'+config.db.url);

// Setup hack-express database.

nano.db.create(config.db.name, function(err, body) {
  if (!err) {
    console.log('Database ' + config.db.name + ' created!');
  } else {
    console.log('Error: ' + err.reason);
  }
});

// Install to hack-express database design documents.

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

// Setup hack-express-sessions database.

nano.db.create('hack-express-session', function(err, body) {
  if (!err) {
    console.log('Database ' + 'hack-express-session' + ' created!');
  } else {
    console.log('Error: ' + err.reason);
  }
});

// Install hack-express-sessions database design documents.

db = nano.use('hack-express-session');

design_docs = fs.readdirSync('./design_docs/' + 'hack-express-session');

design_docs.forEach(function(design_doc) {
  var file = fs.readFileSync(path.join('./design_docs', 'hack-express-session', design_doc));
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