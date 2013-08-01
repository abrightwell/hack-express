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
var Token = require('../../model/token')(database);
var per_page = 10;

// GET /admin/tokens
exports.index = function(req, res) {
	var page = parseInt(req.param('page')) || 1;
	var offset = (page - 1) * per_page;

	query = {$query: {}, $orderby: { description: 1 }};
	fields = {};
	options = {'skip': offset, 'limit': per_page};

	Token.find(query, fields, options, function(err, tokens) {
		if (err) {
			logger.log('error', err);
		} else {
			Token.count(function(err, total) {
				var page_count = (total / per_page);

				locals = {
					'total': total,
					'page_count': page_count,
					'page': page,
					'tokens': tokens
				};

				res.render('admin/tokens/index', locals);
			});
		}
	});
};

// GET /admin/tokens/new
exports.new = function(req, res) {
	var token = new Token();
	res.render('admin/tokens/new', {'token': token});
};

// POST /admin/tokens
exports.create = function(req, res) {
	var token = new Token(req.body);

	token.save(function(err) {
		if (err) {
			logger.log('error', 'Failed saving new token.');
		} else {
			logger.log('info', "Successfully created new token: " + token._id);
			res.redirect('/admin/tokens');
		}
	});
};

// GET /admin/tokens/:id/show
exports.show = function(req, res) {
	var id = req.params.id;

	Token.findById(id, function(err, token) {
		if (err) {
			logger.log('error', err);
		} else {
			res.render('admin/tokens/show', {'token': token});
		}
	});
};

// GET /admin/tokens/:id/edit
exports.edit = function(req, res) {
	var id = req.params.id;

	Token.findById(id, function(err, token) {
		if (err) {
			logger.log('error', err);
		} else {
			res.render('admin/tokens/edit', {'token': token});
		}
	});
};

// PUT /admin/tokens/:id
exports.update = function(req, res) {
	var id = req.params.id;
	var token = req.body;
	
	Token.findByIdAndUpdate(id, {$set: token}, function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			res.redirect('/admin/tokens');
		}
	});
};

// DELETE /admin/tokens/:id
exports.destroy = function(req, res) {
	var id = req.params.id;

	Token.findByIdAndRemove(id, function(err, result) {
		if (err) {
			logger.log('error', 'Error deleting token - ' + err);
		} else {
			logger.log('info', 'Successfully deleted token - ' + id);
			res.redirect('/admin/tokens');
		}
	});
};
