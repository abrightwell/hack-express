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
 * Authors:  Adam Brightwell, Robert Dunigan
 */

var bcrypt = require('bcrypt');

exports.show = function(req, res){
  res.render('Registration');
};

/*
 * Submit Registration.
 * Attempt to create user in DB.
 * If successful, render Registration page with SUCCESS.
 * Else render page with ERROR.
 */

exports.submit = function(req, res){
  //User credentials to be created
  var username = req.param("username");
  var password = req.param("password");

  hack_db.view('users', 'by_username', {key: username}, function(err, body) {
    if (err) {
      // TODO create flash message about query failure.
      res.redirect('/');
    } else {
      var user = body.rows[0];
      if (typeof user == 'undefined') {
        createUser(username, password, function() {
          res.redirect('/');
        }, function() {
          // TODO create flash message about user creation failure.
          res.redirect('/login')
        });
      } else {
        // TODO create flash message about user already existing.
        res.redirect('/login');
      }
    }
  });
};

/**
 * Create a user with the provided username and password.  The user will
 * be created and stored with a hashed password.  However, the 'password' field 
 * must be passed to this function in clear text.
 * 
 * username: the username of the user to create.
 * password: the clear text password of the user to create.
 * success: callback used if the user was successfully created.
 * failure: callback used if the user creation failed.
 */
function createUser(username, password, success, failure) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  
  user_entry = {username: username, password: hash, type: 'user'};
  
  hack_db.insert(user_entry, function(err, body) {
    if (err) {
      failure();
    } else {
      success();
    }
  });
}