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

// GET /admin/tokens
exports.index = function(req, res) {
	Token.find(function(err, tokens) {
		if (err) {
			logger.log('error', err);
		} else {
			res.render('admin/tokens/index', {'tokens': tokens});
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

// GET /admin/tokens/:id
exports.show = function(req, res) {

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

};

// DELETE /admin/tokens/:id
exports.destroy = function(req, res) {

};