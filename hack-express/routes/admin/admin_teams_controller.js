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

var database = require('../../database').connection;
var Team = require('../../model/team')(database);
var per_page = 10;

// GET /admin/teams
exports.index = function(req, res) {
	var page = parseInt(req.param('page')) || 1;
	var offset = (page - 1) * per_page;

	query = {$query: {}, $orderby: { name: 1 }};
	fields = {};
	options = {'skip': offset, 'limit': per_page};

	Team.find(query, fields, options, function(err, teams) {
		if (err) {
			logger.log('error', err);
		} else {
			Team.count(function(err, total) {
				var page_count = (total / per_page);

				locals = {
					'total': total,
					'page_count': page_count,
					'page': page, 
					'teams': teams
				};

				res.render('admin/teams/index', locals);
			});
		}
	});
};

// GET /admin/teams/new
exports.new = function(req, res) {
	var team = new Team();
	res.render('admin/teams/new', {'team': team});
};

// POST /admin/teams
exports.create = function(req, res) {
	var team = new Team(req.body);

	team.save(function(err) {
		if (err) {
			logger.log('error', 'Failed saving new team.');
		} else {
			logger.log('info', "Successfully created new team: " + team._id);
			res.redirect('/admin/teams');
		}
	});
};

// GET /admin/teams/:id/show
exports.show = function(req, res) {
	var id = req.params.id;

	Team.findById(id, function(err, team) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/teams/show', {'team': team});
		}
	});
};

// GET /admin/teams/:id/edit
exports.edit = function(req, res) {
	var id = req.params.id;
	var path = 'members';
	var select = {'id': 1, 'username': 1};


	Team.findById(id).populate(path, select).exec(function(err, team) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/teams/edit', {'team': team});
		}
	});
};

// PUT /admin/teams/:id
exports.update = function(req, res) {
	var id = req.params.id;
	var team = req.body;

	Team.findByIdAndUpdate(id, 
		{ $set: team }, 
		function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			console.log(result);
			res.redirect('/admin/teams');
		}
	});
};

// DELETE /admin/teams/:id
exports.destroy = function(req, res) {
	var id = req.params.id;

	Team.findByIdAndRemove(id, function(err, result) {
		if (err) {
			logger.log('error', 'Error removing deleting team - ' + err);
		} else {
			logger.log('info', 'Successfully deleted team: ' + id);
			res.redirect('/admin/teams');
		}
	});
};

// DELETE
// /admin/teams/:id/members/:user_id 
exports.remove_member = function(req, res) {
	var id = req.params.id;
	var user_id = req.params.user_id;
	var update_stmt = {$pull: {'members': user_id}};

	Team.findByIdAndUpdate(id, update_stmt, function(err, result) {
		if (err) {
			logger.log('error', 'Error removing team member: ' + err);
		} else {
			User.findByIdAndUpdate(user_id, {$set: {'team_id': null}}, function() {
				if (err) {
					logger.log('error', 'Error removing team from user: ' + err);
				} else {
					res.redirect('/admin/teams');
				}
			});
		}
	});
}
