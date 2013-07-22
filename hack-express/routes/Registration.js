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

var async = require('async');
var auth = require('../auth');
var database = require('../database').connection;
var User = require('../model/user')(database);
var Note = require('../model/note')(database);
var Team = require('../model/team')(database);

exports.show = function(req, res) {
  Team.find({}, {'name': 1}).sort({'name': 1}).exec(function(err, teams) {
    if (err) {
      console.log('Error getting teams for registration.');
    } else {
      res.render('Registration', {'teams': teams});
    }
  });
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
  var email = req.param("email");
  var team_id = req.param("team_id");

  // var users = hack_db.collection('users');

  User.findOne({username: username}, function(err, result) {
    if (err) {
      req.flash('error', 'Error crap'); //TODO create flash message about query failure.
      res.redirect('/');
    } else {
      if (result == null) {
        async.waterfall([
          function(callback) {
            if (password == confirm) {
              auth.encrypt(password, callback);
            } else {
              req.flash('info', "Passwords do not match.");
              var err = new Error("Passwords do not match.");
              callback(err, null);
            }
          },
          function(hash, callback) {
            user = new User({
              username: username,
              password: hash,
              email: email,
              team_id: team_id
            });

            user.save(function(err, result) {
              callback(err, result);
            });
          },
          function(user, callback) {
            add_user_to_team(user._id, user.team_id, callback);
          }
        ], function(err, result) {
          if (err) {
            console.log("Error: " + err);
            res.redirect('/registration');
          } else {
            res.redirect('/');
          }
        });
      } else {
        req.flash('info', 'User name already exists.');
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
  if (password !== confirm) {
    failure('Passwords do not match.');
  } else {
	  //Create new user
    async.waterfall([
      function(callback) {
        auth.encrypt(password, callback);
      },
      function(hash, callback) {
        user = new User({
          username: username,
          password: hash
        });
        user.save(callback);
      }
    ], function(err, result) {
      console.log("Registration: ");
      console.log(result);
      if (err) {
        failure();
      } else {
        success();
      }
    });
  }
};

var add_user_to_team = function(user_id, team_id, callback) {
  Team.findByIdAndUpdate(team_id, {$addToSet: {'members': user_id}}, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log(callback);
      callback(null, result);
    }
  });
};