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

var bcrypt = require('bcrypt');

module.exports.authenticate = function(username, password, callback) {
  hack_db.view('users', 'by_username', {key: username}, function(err, body) {
    
    if (err) {
      console.log(err.reason);
    }

    user = body.rows[0].value;
    
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        callback(user);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
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


