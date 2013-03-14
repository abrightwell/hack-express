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
  hack_db.view('users', 'scores', {group: true, group_level: 1}, function(err, body) {
    if (err) {
      console.log("Error getting user scores: " + err.reason);
    } else {
      res.render('scoreboard', {
        title: 'Scoreboard', 
        userScores: body.rows
      });
    }
  });
};

