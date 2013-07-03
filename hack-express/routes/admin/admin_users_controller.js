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

var bcrypt = require('bcrypt');
var database = require('../../database').connection;
var User = require('../../model/user')(database);
var log = require('../../log');
var logger = log.getLogger();
var per_page = 10;
var Note = require('../../model/note')(database);

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

// GET /admin/users/:id
exports.show = function(req, res) {

};

// GET /admin/users/:id/edit
exports.edit = function(req, res) {
	var id = req.params.id;

	User.findById(id, function(err, user) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/users/edit', {'user': user});
		}
	});
};

// PUT /admin/users/:id
exports.update = function(req, res) {
	var id = req.params.id;
	var user = req.body;

	User.findByIdAndUpdate(id, {$set: user}, function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			res.redirect('/admin/users');
		}
	});
};

// DELETE /admin/users/:id
exports.destroy = function(req, res) {

};
