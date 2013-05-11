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
  var confirm  = req.param("confirm");

  var users = hack_db.collection('users');

  users.findOne({username: username}, function(err, result) {
    if (err) {
      req.flash('error', 'Error crap'); //TODO create flash message about query failure.
      res.redirect('/');
    } else {
      if (result == null) {
        createUser(username, password, confirm,
          function() {
            req.flash('info', 'Successfully created account.');
            res.redirect('/');
          },
          function(message) {
            if (message !== 'undefined') {
              req.flash('info', 'Failed to create account: ' + message);  
            } else {
              req.flash('info', 'Failed to create account.');
            }
            res.redirect('/registration')
          }
        );
      } else {
        req.flash('info', 'User name already exists.')
        res.redirect('/registration');
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
function createUser(username, password, confirm, success, failure) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  
  user_entry = {username: username, password: hash, type: 'user'};
  
  if (password !== confirm) {
    failure('Passwords do not match.');
  } else {
    users = hack_db.collection('users');
    users.insert(user_entry, function(err, result) {
      if (err) {
        failure();
      } else {
        success();
      }
    });
  }
}