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

var User = require('../model/user');
var Token = require('../model/token');
var ObjectId = require('mongodb').ObjectId;

/**
 * Display the submission page with the users achieved tokens.
 */
exports.show = function(req, res) {
  User.findOne({_id: req.session.user._id})
  .populate('tokens')
  .exec(function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('Submissions', {tokens: user.tokens});
    }
  });
};

/*
 * Submit a token value to be claimed by a user.
 */
exports.submit = function(req, res) {  
  var tokenValue = req.param("tokenID");
  var userId = req.session.user._id;

  Token.findOne({value: tokenValue}, function(error, token) {
    if (error) {
      req.flash('error', 'An error occured trying to claim the token');
      console.error(error);
    } else {
      if (token != null) {

        var query = {_id: userId, tokens: {$nin: [token.id]}};
        var update = {$push: {tokens: token.id}};

        User.findOneAndUpdate(query, update, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            req.flash('info', 'You have successfully claimed the token');
          }
        });
      } else {
        req.flash('info', 'Sorry, that is not a valid token or you have already claimed it.')
      }
    }
    res.redirect('/submissions');
  });

  // claimToken(username, tokenValue, function(err, result) {
  //   if (err) {
  //     req.flash('info', 'An error occured trying to claim the token.');
  //   } else {
  //     if (result) {
  //       req.flash('info', 'You have successfully claimed the token');
  //     } else {
  //       req.flash('info', 'Sorry, that is not a valid token or you have already claimed it.');
  //     }
  //   }

}

/**
 * Claim a token for a user.
 *
 * user - the user claiming the token.
 * token - the token the user is claiming.
 * success - callback to handle successful claim of token.
 * failure - callback to handle failure for claim of token.
 */
function claimToken(username, token_value, callback) {
  hack_db.collection('tokens', function(err, tokens) {
    if (err) {
      console.log('Error accessing tokens collection.');
      callback(err, null);
    } else {
      tokenExists(token_value, function(err, token) {
        if (err) {
          callback(err, null);
        } else {
          if (token != null) {
            callback()
          } else {

          }
        }
      });

      tokens.findOne({'value': token_value}, function(err, result) {
        if (result != null) {
          // use findAndModify instead.
          hack_db.collection('users')
          getTokenIdsByUser(username, function(err, user_tokens) {
            if (!user_tokens.contains(result._id)) {
              users = hack_db.collection('users');
              user = users.update({'username': username}, {$push: {tokens: result._id}});
              callback(null, true);
            } else {
              callback(null, false);
            }
          });
        } else {
          callback(null, false);
        }
      });
    }
  });
}
