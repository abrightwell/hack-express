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

var bcrypt = require('bcrypt'),
	database = require('./database').connection,
    User = require('./model/user')(database);

module.exports.authenticate = function(username, password, callback) {
	User.findOne({'username': username}, function(err, user) {
		if (user) {
			compareLogin(password, user, function() {
				callback(user);
			}, function() {
				callback('undefined');
			});
		} else {
			callback('undefined');
		}
	});
}

/**
 * Compares login info for a user.
 *
 * user - the user claiming the token.
 * token - the token the user is claiming.
 * success - callback to handle successful claim of token.
 * failure - callback to handle failure for claim of token.
 */
function compareLogin(password, user, success, failure) {
	if (bcrypt.compareSync(password, user.password)) {
		success();
	} else {
		failure();
	}
}

module.exports.encrypt = function(value, callback) {
	var salt = bcrypt.genSaltSync(10);
  	var hash = bcrypt.hashSync(value, salt);
  	callback(null, hash);
}

/**
 * Function to enforce login on routes requiring protection.
 */
module.exports.requiresLogin = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login?redir=' + req.url);
  }
}


