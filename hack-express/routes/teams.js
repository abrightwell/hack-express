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

var database = require('../database').connection,
    User = require('../model/user')(database),
    Token = require('../model/token')(database),
    Team = require('../model/team')(database),
    ObjectId = require('mongodb').ObjectId;

exports.index = function(req, res) {
	Team.find(function(err, teams) {
		if (err) {
			console.log(err.reason);
		} else {
			res.render('teams/index', {'teams': teams});
		}
	});
};

exports.show = function(req, res) {
	var id = req.params.id;
	Team.findOne({_id: id}, function(err, team) {
		res.render('teams/show', {'team': team});
	});
};

exports.edit = function(req, res) {
	var id = req.params.id;
	Team.findOne({_id: id}, function(err, team) {
		res.render('teams/edit', {'team': team});
	});
};

exports.update = function(req, res) {
	var id = req.params.id;
	var team = req.body;
	Team.findByIdAndUpdate(id, {$set: team}, function(err, result) {
		res.redirect('/teams/' + id);
	});
};

exports.destroy = function(req, res) {

};