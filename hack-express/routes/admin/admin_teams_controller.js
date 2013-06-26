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

// GET /admin/teams
exports.index = function(req, res) {
	Team.find(function(err, teams) {
		if (err) {
			logger.log('error', err);
		} else {
			res.render('admin/teams/index', {'teams': teams});
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

// GET /admin/teams/:id
exports.show = function(req, res) {

};

// GET /admin/teams/:id/edit
exports.edit = function(req, res) {
	var id = req.params.id;

	Team.findById(id, function(err, team) {
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

	Team.findByIdAndUpdate(id, {$set: team}, function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			res.redirect('/admin/teams');
		}
	});
};

// DELETE /admin/teams/:id
exports.destroy = function(req, res) {

};