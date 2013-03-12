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
 *Authors:  Robert Dunigan
 */

/**
 * Module dependencies.
 */

var config = require('./config');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , Registration = require('./routes/Registration')
  , Login = require('./routes/Login')
  , Scoreboard = require('./routes/Scoreboard')
  , Hints = require('./routes/Hints')
  , Notes = require('./routes/Notes')
  , Submissions = require('./routes/Submissions')
  , Logout = require('./routes/Logout')
  , http = require('http')
  , path = require('path')
  , https = require('https')
  , fs = require('fs')
  , auth = require('./auth')
  , flash = require('connect-flash');

ConnectCouchDB = require('connect-couchdb')(express);

var store = new ConnectCouchDB({
  host: 'localhost',
  port: '5984',
  name: 'hack-express-sessions',
  reapInterval: 600000,
  compactInterval: 300000,
  setThrottle: 60000
});

//SSL Key/Cert
//Place in app.js directory

var sslkey = fs.readFileSync(config.ssl.key).toString();  //added for https
var sslcert = fs.readFileSync(config.ssl.cert).toString(); //added for https
  
// your admin credentials
var username = 'hack_admin';
var userpass = '';

//Database module used for communication between Express and CouchDB
nano = require('nano')(config.db.url);

hack_db = nano.db.use(config.db.name);

//Added for https
var options = {
  key : sslkey,
  cert : sslcert
}

app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 443);   //modified for https
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('0708aa9e17c6090c04a5e7ea2b482bb7'));
  app.use(express.session({secret: 'secret', store: store}));
  app.use(flash());
  
  app.use(function(req, res, next) {
    res.locals({user: req.session.user});
    next();
  });
  
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
});

app.configure('development', function() {
  app.use(express.errorHandler());
});



/**
 * Hack Warz Routes
 */
app.get('/', routes.index);
app.get('/registration', Registration.show);
app.post('/registration/submit', Registration.submit);
app.get('/login', Login.show);
app.post('/login/submit', Login.submit);
app.get('/scoreboard', auth.requiresLogin, Scoreboard.show);
app.get('/hints', auth.requiresLogin, Hints.show);
app.post('/hints/buy', auth.requiresLogin, Hints.buy);
app.get('/notes', auth.requiresLogin, Notes.show);
app.post('/notes/submitNetwork', auth.requiresLogin, Notes.submitNetwork);
app.post('/notes/submitCredentials', auth.requiresLogin, Notes.submitCredentials);
app.post('/notes/submitCrypto', auth.requiresLogin, Notes.submitCrypto);
app.post('/notes/submitMisc', auth.requiresLogin, Notes.submitMisc);
app.get('/submissions', auth.requiresLogin, Submissions.show);
app.post('/submissions/submit', auth.requiresLogin, Submissions.submit);
app.get('/logout', Logout.show);

//Modified for https

https.createServer(options, app).listen(app.get('port'), function() {
  console.log("Express server listening on port:  " + app.get('port'));
});
