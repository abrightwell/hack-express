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
var async = require('async');
var auth = require('../../auth');
var database = require('../../database').connection;
var User = require('../../model/user')(database);
var Team = require('../../model/team')(database);
var log = require('../../log');
var logger = log.getLogger();
var per_page = 10;
var Note = require('../../model/note')(database);
var Team = require('../../model/team')(database);

// GET /admin/users
exports.index = function(req, res) {
	var page = parseInt(req.param('page')) || 1;
	var offset = (page - 1) * per_page;

	query = {$query: {}, $orderby: { username: 1 }};
	fields = {};
	options = {'skip': offset, 'limit': per_page};

	User.find(query, fields, options, function(err, users) {
		if (err) {
			logger.log('error', err);
		} else {
			User.count(function(err, total) {
				var page_count = (total / per_page);

				locals = {
					'total': total,
					'page_count': page_count,
					'page': page, 
					'users': users
				};

				res.render('admin/users/index', locals);
			});
		}
	});
};

// GET /admin/users/new
exports.new = function(req, res) {
	var user = new User();
	res.render('admin/users/new', {'user': user});
};

// POST /admin/users
exports.create = function(req, res) {
	
	var salt = bcrypt.genSaltSync(10);
	req.body.password = bcrypt.hashSync(req.body.password, salt);	
	
	var user = new User(req.body);
	var note = new Note({userId: user.id});
	
	//Save note first
	note.save(function(err) {
		if (err) {
			logger.log('error', 'Failed saving new note.');
		} else {
			logger.log('info', "Successfully created new note: " + note._id);
		}
	});
	
	//Add note reference to user
	user.notes.push(note);
	
	//Save user
	user.save(function(err) {
		if (err) {
			logger.log('error', 'Failed saving new user.');
		} else {
			logger.log('info', "Successfully created new user: " + user._id);
			res.redirect('/admin/users');
		}
	});
};

// GET /admin/users/:id/show
exports.show = function(req, res) {
	var id = req.params.id;

	User.findById(id, function(err, user) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/users/show', {'user': user});
		}
	});
};

// GET /admin/users/:id/edit
exports.edit = function(req, res) {
	var id = req.params.id;

	User.findById(id, function(err, user) {
		Team.find(function(err, teams) {
			if (err) {
				logger.log('error', err.reason);
			} else {
				res.locals.user = user;
				res.locals.teams = teams;
				res.render('admin/users/edit');
			}
	    });
	});
};

// PUT /admin/users/:id
exports.update = function(req, res) {
	var id = req.params.id;
	var user = req.body;

	User.findById(id, function(err, user_result) {
		if (err) {
			logger.log('error', 'Error finding user: ' + err);
		} else {
			async.series([
				function(callback) {
					remove_user_from_team(user_result, callback);	
				},
				function(callback) {
					add_user_to_team(id, user.team_id, callback);
				},
				function(callback) {
					user_result.update({$set: user}, callback);
				}
			], function(err, result) {
				if (err) {
					logger.log('error', 'Error updating user: ' + err);
				} else {
					res.redirect('/admin/users');
				}
			});
		}
	});
};

// PUT /admin/users/:id/password
exports.update_password = function(req, res) {
	var id = req.params.id;

	var password = req.body.password;
	var confirm = req.body.confirm;

	if (password == confirm) {
		auth.encrypt(password, function(err, hash) {
			User.findByIdAndUpdate(id, {$set: {password: hash}}, function(err, result) {
				if (err) {
					logger.log('error', 'Error updating password: ' + err);
				} else {
					logger.log('info', 'Successfully updated password');
				}
				res.redirect('/admin/users/' + id + '/edit#password')
			});
		});	
	} else {
		logger.log('error', 'password != confirm');
	}
}

// DELETE /admin/users/:id
exports.destroy = function(req, res) {
	var id = req.params.id;

	User.findByIdAndRemove(id, function(err, result) {
		if (err) {
			logger.log('error', 'Error removing deleting user - ' + err);
		} else {
			logger.log('info', 'Successfully deleted user: ' + id);
			res.redirect('/admin/users');
		}
	});
};

// Helper Functions.

add_user_to_team = function(user_id, team_id, callback) {
	Team.findByIdAndUpdate(team_id, {$addToSet: {'members': user_id}}, function(err, result) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, result);
		}
	});
};

remove_user_from_team = function(user, callback) {
	var update_stmt = {$pull: {'members': user.id}};

	Team.findByIdAndUpdate(user.team_id, update_stmt, function(err, result) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, result);
		}
	});
};
