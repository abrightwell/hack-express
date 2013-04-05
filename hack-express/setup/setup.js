/*
 *   Copyright 2013 Life Cycle Engineering
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/*
 *Authors:  Adam Brightwell
 */

var config = require('../config');
var fs = require('fs');
var path = require('path');

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