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
var User = require('../../model/team')(database);
var log = require('../../log');
var logger = log.getLogger();

// GET /admin/users
exports.index = function(req, res) {
	User.find(function(err, users) {
		if (err) {
			logger.log('error', err);
		} else {
			res.render('admin/users/index', {'users': users});
		}
	});
};

// GET /admin/users/new
exports.new = function(req, res) {

};

// POST /admin/users
exports.create = function(req, res) {

};

// GET /admin/users/:id
exports.show = function(req, res) {

};

// GET /admin/users/:id/edit
exports.edit = function(req, res) {

};

// PUT /admin/users/:id
exports.update = function(req, res) {

};

// DELETE /admin/users/:id
exports.destroy = function(req, res) {

};