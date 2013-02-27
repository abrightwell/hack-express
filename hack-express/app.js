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

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , Registration = require('./routes/Registration')
  , Login = require('./routes/Login')
  , Main = require('./routes/Main')
  , Scoreboard = require('./routes/Scoreboard')
  , Hints = require('./routes/Hints')
  , Notes = require('./routes/Notes')
  , Submissions = require('./routes/Submissions')
  , Logout = require('./routes/Logout')
  , http = require('http')
  , path = require('path')
  , https = require('https')  //added for https
  , fs = require('fs');       //added for https
  
  //SSL Key/Cert
  //Place in app.js directory
  var sslkey = fs.readFileSync('serverkey.pem').toString();  //added for https
  var sslcert = fs.readFileSync('cacert.pem').toString();     //added for https
  
  // your admin credentials
  var username = 'hack_admin';
  var userpass = '';

  //Database module used for communication between Express and CouchDB
  nano = require('nano')('https://'+username+':'+userpass+'@localhost:6984');
  //nano = require('nano')('https://'+username+':'+userpass+'@192.168.100.42:6984');

//Create the hack_db database within CouchDB if it doesn't already exist
nano.db.create('hack_db', function(err, body) {
  if (!err) {
    console.log('database hack_db created!');
  }
});

//List databases within CouchDB to verify creation/existance
nano.db.list(function(err, body) {
  console.log("\n");
  console.log("\nExisting Databases:");
  //body is an array
  body.forEach(function(db) {
    console.log(db);
    });
  });

//Create aliases for manipulation of the databases
//These global variables are using the admin privileges from above
hack_db = nano.db.use('hack_db');
_users = nano.db.use('_users');
_session = nano.db.use('_session');

//Added for https
var options = {
  key : sslkey
, cert : sslcert
}

app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 443);   //modified for https
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  //app.use(express.cookieParser('secret-string-is-secret'));
  app.use(express.cookieParser('0708aa9e17c6090c04a5e7ea2b482bb7'));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/users', user.list);

/**
 * Hack Warz Routes
 */
app.get('/registration', Registration.show);
app.post('/registration/submit', Registration.submit);
app.get('/login', Login.show);
app.post('/login/submit', Login.submit);
app.get('/main', Main.show);
app.get('/scoreboard', Scoreboard.show);
app.get('/hints', Hints.show);
app.post('/hints/buy', Hints.buy);
app.get('/notes', Notes.show);
app.post('/notes/submitNetwork', Notes.submitNetwork);
app.post('/notes/submitCredentials', Notes.submitCredentials);
app.post('/notes/submitCrypto', Notes.submitCrypto);
app.post('/notes/submitMisc', Notes.submitMisc);
app.get('/submissions', Submissions.show);
app.post('/submissions/submit', Submissions.submit);
app.get('/logout', Logout.show);

//Modified for https
https.createServer(options,app).listen(app.get('port'), function(){
  console.log("Express server listening on port:  " + app.get('port'));
});
