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

var async = require('async');
var database = require('../database').connection;
var User = require('../model/user')(database);
var Team = require('../model/team')(database);

/**
 * Gets and displays the scoreboard values.
 *
 * The scoreboard values are added to the response locals value as:
 *
 * 'res.locals.userScores'
 *
 * To access the values in the 'res.locals.userScores'
 *
 * key   -> the username
 * value -> the point value
 *
 */
exports.show = function(req, res) {
  var scores = [];
  User.find({}, {username: 1, team_id: 1, tokens: 1})
    .populate('team_id', {name: 1})
    .populate('tokens', {points: 1})
    .exec(function (err, users) {
      async.parallel(
        {
          user_scores: function(callback) {
            get_user_scores(users, callback);
          },
          team_scores: function(callback) {
            get_team_scores(users, callback);
          }
        },
        function(err, results) {
          if (err) {
            console.log('Error getting scores: ' + err);
          } else {
            res.render('Scoreboard', {
              title: 'Scoreboard',
              userScores: results.user_scores,
              teamScores: results.team_scores,
              refreshTime: config.page.refreshTime
            });
          }
        }
      );
    });
};

/**
 * Creates a mapped array of user scores.  This function should is 
 * equivalent to the mapping function of a map/reduce set.
 *
 * users    -> collection of users.
 * callback -> returns err and scores.
 */
var map_user_scores = function(users, callback) {
  var scores = [];
  
  users.forEach(function(user) {
      scores.push({key: user.username, value: 0});
    user.tokens.forEach(function(token) {
      scores.push({key: user.username, value: token.points});
    });
  });

  callback(null, scores);
};

/**
 * Reduces mapped values for user scores.  This function is
 * equivalent to the reduce function of a map/reduce set.
 *
 * users    -> the mapped user scores to reduce.
 * callback -> returns err and scores.
 */
var reduce_user_scores = function(users, callback) {
  var scores = {};

  users.forEach(function(user) {
    if (scores[user.key] == null) scores[user.key] = 0;
    scores[user.key] += user.value;
  });

  callback(null, scores);
};

/**
 * Get an array of user scores.
 *
 * users    -> user information.
 * callback -> returns err and array of scores. Scores will be an
 * array of objects with the following signature:
 * {username: <username>, score: <score>}
 */
var get_user_scores = function(users, callback) {
  map_user_scores(users, function(err, result) {
    reduce_user_scores(result, function(err, result) {
      scores = [];
      
      Object.keys(result).forEach(function(key) {
        scores.push({username: key, score: result[key]});
      });

      callback(null, scores);
    });
  });
};

/**
 *
 */
var map_team_scores = function(users, callback) {
  var teams = [];
  users.forEach(function(user) {
    if (user.team_id != null) {
      teams.push({key: user.team_id.name, value: 0});
      user.tokens.forEach(function(token) {
        if (user.team_id != undefined) {
          teams.push({key: user.team_id.name, value: token.points});
        }
      })
    }
  });
  
  callback(null, teams);
}

/**
 *
 */
var reduce_team_scores = function(teams, callback) {
  var scores = {};

  teams.forEach(function(team) {
    if (scores[team.key] == null) scores[team.key] = 0;
    scores[team.key] += team.value;
  });

  callback(null, scores);
}

/**
 *
 */
var get_team_scores = function(users, callback) {
  async.waterfall([
    function(callback) {
      var team_scores = {};

      users.forEach(function(user) {
        if (user.team_id != null) {
          team_scores[user.team_id.name] = team_scores[user.team_id.name] || {};

          user.tokens.forEach(function(token) {  
            if (user.team_id != undefined) {
              team_scores[user.team_id.name][token.id] = token.points;
            }
          });
        }
      });
      callback(null, team_scores);
    },
    function(team_scores, callback) {
      scores = [];

      Object.keys(team_scores).forEach(function(team) {
        var score = 0;
        Object.keys(team_scores[team]).forEach(function(token) {
          score += team_scores[team][token];    
        });

        scores.push({'name': team, 'score': score});  
      });

      callback(null, scores);
    }
  ], function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
  });
}
