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
 *Authors:  Adam Brightwell, Robert Dunigan
 */

/**
 * Module dependencies.
 */

config = require('./config');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , https = require('https')
  , fs = require('fs')
  , auth = require('./auth')
  , locals = require('./locals')
  , cache = require('./cache')
  , flash = require('connect-flash')
  , winston = require('winston')
  , log = require('./log')
  , expressValidator = require('express-validator');

var mongoose = require('mongoose');

// Database Configuration and Initialization.
MongoStore = require('connect-mongo')(express);

var store = new MongoStore({
  host: config.session.db.host,
  port: config.session.db.port,
  db: config.session.db.name,
  ssl: config.session.db.ssl,
  collection: 'sessions'
});

//Instantiate a winston logger
logger = log.getLogger();

//SSL Key/Cert
var sslkey = fs.readFileSync(config.ssl.key).toString();
var sslcert = fs.readFileSync(config.ssl.cert).toString();
var options = { key : sslkey, cert : sslcert };

app = express();

app.configure(function() {
  app.set('port', process.env.PORT || config.ssl.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));  //Default Expressjs logger
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(express.cookieParser('0708aa9e17c6090c04a5e7ea2b482bb7'));
  app.use(express.session({secret: 'secret', store: store}));
  app.use(flash());
  
  //Get locals
  app.use(locals.getLocals);
  
  //Nginx forwarding
  app.use(cache.forward);
  
  app.use(express.methodOverride());
  app.use(app.router);
  //Express static file caching
  app.use(express.static(__dirname + '/public', {maxAge: config.cache.max_age}));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

var routes = require('./routes')(app);

/*
 * Unimplemented Routes
 */
//app.get('/admin', admin.show);
//app.post('/notes/submitNetwork', auth.requiresLogin, Notes.submitNetwork);
//app.post('/notes/submitCredentials', auth.requiresLogin, Notes.submitCredentials);
//app.post('/notes/submitCrypto', auth.requiresLogin, Notes.submitCrypto);
//app.post('/notes/submitMisc', auth.requiresLogin, Notes.submitMisc);

//Create server and start listening
https.createServer(options, app).listen(app.get('port'), function() {
  logger.log("info", "Express server listening on port:  " + app.get('port'));
});
