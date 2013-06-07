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
  // , database = require('./database')
  , routes = require('./routes')
  , user = require('./routes/user')
  // , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  , https = require('https')
  , fs = require('fs')
  , auth = require('./auth')
  , flash = require('connect-flash')
  , winston = require('winston')
  , log = require('./log');

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
var sslkey = fs.readFileSync(config.ssl.key).toString();  //added for https
var sslcert = fs.readFileSync(config.ssl.cert).toString(); //added for https

//Added for https
var options = { key : sslkey, cert : sslcert };

app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 443);   //modified for https
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  //app.use(express.logger('dev'));  //Default Expressjs logger
  app.use(express.bodyParser());
  app.use(express.cookieParser('0708aa9e17c6090c04a5e7ea2b482bb7'));
  app.use(express.session({secret: 'secret', store: store}));
  app.use(flash());
  
  app.use(function(req, res, next) {
    res.locals({
      user: req.session.user,
      messages: req.flash()
    });
    next();
  });
  
  /**
   * This is required for nginx.
   */
   app.use(function(req, res, next) {
     req.forwardedSecure = req.headers["x-forwarded-proto"] === "https";
     return next();
   });
  
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

var routes = require('./routes')(app);

/*
 * Unimplemented Routes
 */
//app.get('/admin', admin.show);
//app.get('/hints', auth.requiresLogin, Hints.show);
//app.post('/hints/buy', auth.requiresLogin, Hints.buy);
//app.get('/notes', auth.requiresLogin, Notes.show);
//app.post('/notes/submitNetwork', auth.requiresLogin, Notes.submitNetwork);
//app.post('/notes/submitCredentials', auth.requiresLogin, Notes.submitCredentials);
//app.post('/notes/submitCrypto', auth.requiresLogin, Notes.submitCrypto);
//app.post('/notes/submitMisc', auth.requiresLogin, Notes.submitMisc);

//Modified for https
https.createServer(options, app).listen(app.get('port'), function() {
  logger.log("info", "Express server listening on port:  " + app.get('port'));
});
