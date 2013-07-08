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
var Hint = require('../../model/hint')(database);

// GET /admin/hints
exports.index = function(req, res) {
	Hint.find(function(err, hints) {
		if (err) {
			logger.log('error', err);
		} else {
			res.render('admin/hints/index', {'hints': hints});
		}
	});
};

// GET /admin/hints/new
exports.new = function(req, res) {
	var hint = new Hint();
	res.render('admin/hints/new', {'hint': hint});
};

// POST /admin/hints
exports.create = function(req, res) {
	var hint = new Hint(req.body);

	hint.save(function(err) {
		if (err) {
			logger.log('error', 'Failed saving new hint.');
		} else {
			logger.log('info', "Successfully created new hint: " + hint._id);
			res.redirect('/admin/hints');
		}
	});
};

// GET /admin/hints/:id/show
exports.show = function(req, res) {
	var id = req.params.id;

	Hint.findById(id, function(err, hint) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/hints/show', {'hint': hint});
		}
	});
};

// GET /admin/hints/:id/edit
exports.edit = function(req, res) {
	var id = req.params.id;

	Hint.findById(id, function(err, hint) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/hints/edit', {'hint': hint});
		}
	});
};

// PUT /admin/hints/:id
exports.update = function(req, res) {
	var id = req.params.id;
	var hint = req.body;

	Hint.findByIdAndUpdate(id, {$set: hint}, function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			res.redirect('/admin/hints');
		}
	});
};

// DELETE /admin/hints/:id
exports.destroy = function(req, res) {
	var id = req.params.id;

	Hint.findByIdAndRemove(id, function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			res.redirect('/admin/hints');
		}
	});
};
