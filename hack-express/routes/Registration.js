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

/*
 * TO DO:  The registration functionality along with the admin page's
 * user creation functionality needs to be broken out and refactored
 * to simplify and incorporate code reuse.
 */

var bcrypt = require('bcrypt');
    database = require('../database').connection,
    User = require('../model/user')(database),
    Note = require('../model/note')(database);

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

  // var users = hack_db.collection('users');

  User.findOne({username: username}, function(err, result) {
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
  
  if (password !== confirm) {
    failure('Passwords do not match.');
  } else {
	  //Create new user
    user = new User({
      username: username,
      password: hash,
      tokens: [],
      notes:[]
    });
    //Create new note
    note = new Note({
		userId: user.id,
		text: ""
	});
	
	//Save the newly created note
	note.save(function(error, result) {
      if (error) {
        failure('Error saving note: ' + note.text);
      } else {
        success();
      }
    });
    
    //Associate the new note with the new user
    user.notes.push(note);
    
    //Save the newly created user
    user.save(function(error, result) {
      if (error) {
        failure('Error saving user: ' + user.username);
      } else {
        success();
      }
    });
  }
}
