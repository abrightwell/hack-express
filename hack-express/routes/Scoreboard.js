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

var database = require('../database').connection,
    User = require('../model/user')(database);

/**
 * Gets and dispalys the scoreboard values.
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
  User.find()
    .populate('tokens', {points: 1})
    .exec(function (err, users) {
      users.forEach(function(user) {
		//Truncate username strings being displayed to avoid overflow
		if(user.username.length>config.name.max_length) {
			user.username=user.username.substring(0,config.name.max_length)+"...";
		}
		//Set scores
        var score = 0;
        user.tokens.forEach(function(token) {
          score += token.points;
        });
        scores.push({username: user.username, score: score});
      });
    
      res.render('Scoreboard', {
      title: 'Scoreboard',
      userScores: scores,
      refreshTime: config.page.refreshTime
    });
  });
};
