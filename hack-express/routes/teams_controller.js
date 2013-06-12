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

var database = require('../database').connection,
    User = require('../model/user')(database),
    Token = require('../model/token')(database),
    Team = require('../model/team')(database),
    ObjectId = require('mongodb').ObjectId;
    log = require('../log');
    logger = log.getLogger();

// GET /teams
// GET /teams.json
exports.index = function(req, res) {
	Team.find(function(err, teams) {
		if (err) {
			logger.log('error', err);
		} else {
			if (req.params.format == 'json') {
				res.json({'teams': teams});
			} else {
				res.render('teams/index', {'teams': teams});	
			}		
		}
	});
};

// GET /teams/new
// GET /teams/new.json
exports.new = function(req, res) {
	var team = new Team();
	if (req.params.format == "json") {
		res.json(team);
	} else {
		res.render('teams/new', {'team': team});
	}
}

// POST /teams
// POST /teams.json
exports.create = function(req, res) {
	var team = new Team(req.body);

	team.save(function(err) {
		if (err) {
			logger.log('error', 'Failed saving new team.');
		} else {
			logger.log('info', "Successfully created new team: " + team._id);
			if (req.params.format == 'json') {
				res.json(team);
			} else {
				res.render('teams/show', {'team': team});
			}
		}
	});
}

// GET /teams/1
// GET /teams/1.json
exports.show = function(req, res) {
	var id = req.params.id;

	Team.findById(id, function(err, team) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			if (req.params.format == 'json') {
				res.json(team);
			} else {
				res.render('teams/show', {'team': team});
			}
		}
	});
};

// GET /teams/1/edit
exports.edit = function(req, res) {
	var id = req.params.id;
	
	Team.findById(id, function(err, team) {
		res.render('teams/edit', {'team': team});
	});
};

// PUT /teams/1
// PUT /teams/1.json
exports.update = function(req, res) {
	var id = req.params.id;
	var team = req.body;

	Team.findByIdAndUpdate(id, {$set: team}, function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			if (req.params.format == 'json') {
				res.json(result);
			} else {
				res.redirect('/teams/' + id);
			}
		}
	});
};

// DELETE /teams/1
// DELETE /teams/1.json
exports.destroy = function(req, res) {
	var id = req.params.id;

	Team.findByIdAndRemove(id, function(err, result) {
		if (err) {
			logger.log('error', 'Error removing team: ' + id);
		} else {
			if (req.params.format == 'json') {
				res.json();
			} else {
				res.redirect('/teams');
			}
		}
	});
};
