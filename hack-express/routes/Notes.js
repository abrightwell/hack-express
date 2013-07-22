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

var async = require('async');
var database = require('../database').connection,
    User = require('../model/user')(database),
    Team = require('../model/team')(database),
    ObjectId = require('mongodb').ObjectId;

/**
 * Display the notes page with the users submitted notes.
 */
exports.show = function(req, res) {
	var userId = req.session.user._id;
	var select = {'id': 1, 'username': 1};
	async.parallel({
			user_notes: function(callback) {
				User.findById(userId, {'notes': 1}, callback);
			},
			team_notes: function(callback) {
				User.findById(userId, {'team_id': 1}, function(err, user){
					Team.findById(user.team_id, {'members': 1})
						.populate('members', {'username': 1, 'notes': 1})
						.exec(callback);
				});
			}
		},
		function(err, results) {
			if (err) {
				console.log(err);
			} else {
				var locals = {
					'user_notes': results.user_notes.notes,
					'team_notes': results.team_notes
				}
				res.render('Notes', locals);
			}
		}
	);

	// User.findById(userId, {'notes': 1}, function(err, user) {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		res.render('Notes', {'user': user});
	// 	}
	// });
};

exports.submit = function(req, res){
	var notes = req.body.notes;
	var user_id = req.body.user_id;
	
	var update_stmt = {$set: {'notes': notes}};

	User.findByIdAndUpdate(user_id, update_stmt, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/notes');
		}
	});
};
