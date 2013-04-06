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
 * Authors: Adam Brightwell, Robert Dunigan
 */

/**
 * Display the submission page with the users achieved tokens.
 */
exports.show = function(req, res) {
  username = req.session.user.username;
  
  hack_db.view('users', 'tokens', {key: username}, function(err, body) {
    if (err) {
      req.flash('error', 'Error occured fetching user tokens.');
      console.log('Error occured fetching user tokens.');
      res.render('Submissions');
    } else {
      tokens = body.rows.map(function(row) {
		  /*Return masked value minus the last 4 characters*/
		  temp = row.value.token_value;
		  temp2 = "xxxxxxxxxxxx" + temp.substr(12,4);
		  row.value.token_value = temp2;
		  return row.value;});
      res.render('Submissions', {tokens: tokens});      
    }
  });
};

/*
 * Submit a token value to be claimed by a user.
 */
exports.submit = function(req, res) {  
  var tokenValue = req.param("tokenID");
  
  hack_db.view('tokens', 'by_token_value', {key: tokenValue}, function(err, body) {
    if (err) {
      console.log(err.reason);
    } else {
      if (typeof body.rows[0] !== 'undefined') {
        user = req.session.user.username;
        token = body.rows[0].value
        claimToken(user, token, function() {
          req.flash('info', 'You have successfully claimed the token');
          res.redirect('/submissions');
        }, function() {
          console.log('failed to claim');
          req.flash('error', 'An error occured trying to claim the token.');
          res.redirect('/submissions');
        });
      } else {
        console.log('token does not exist.');
        req.flash('info', 'Sorry, that is not a valid token.');
        res.redirect('/submissions');
      }
    }
  });
}

/**
 * Claim a token for a user.
 *
 * user - the user claiming the token.
 * token - the token the user is claiming.
 * success - callback to handle successful claim of token.
 * failure - callback to handle failure for claim of token.
 */
function claimToken(user, token, success, failure) {
  token.users.push(user);
  hack_db.insert(token, function(err, body) {
    if (err) {
      failure();
    } else {
      success();
    }
  });
}
