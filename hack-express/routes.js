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
 *Authors:  Adam Brightwell, Robert Dunigan
 */

var Registration = require('./routes/Registration'),
	Login = require('./routes/Login'),
	Scoreboard = require('./routes/Scoreboard'),
	Submissions = require('./routes/Submissions'),
	Notes = require('./routes/Notes'),
	Hints = require('./routes/Hints'),
	Logout = require('./routes/Logout'),
	input = require('./input'),
	auth = require('./auth'),
	cache = require('./cache'),
	Teams = require('./routes/teams_controller');
	admin = require('./routes/admin/admin_controller');
	admin_teams = require('./routes/admin/admin_teams_controller');
	admin_users = require('./routes/admin/admin_users_controller');
	admin_hints = require('./routes/admin/admin_hints_controller');
	admin_sponsors = require('./routes/admin/admin_sponsors_controller');
	admin_tokens = require('./routes/admin/admin_tokens_controller');

module.exports = function(app) {
	app.get('/', cache.setHeaderPublic, function (req, res) {
  		res.redirect('Scoreboard');
	});

	app.get('/registration', cache.setHeaderPublic, Registration.show);
	app.post('/registration/submit', input.sanitize, Registration.submit);
	app.get('/login', cache.setHeaderPublic, Login.show);
	app.post('/login/submit', input.sanitize, Login.submit);
	app.get('/scoreboard', cache.setHeaderPublic, Scoreboard.show);
	app.get('/submissions', auth.requiresLogin, Submissions.show);
	app.post('/submissions/submit', input.sanitize, auth.requiresLogin, Submissions.submit);
	app.get('/notes', auth.requiresLogin, Notes.show);
	app.post('/notes/submit', input.sanitize, auth.requiresLogin, Notes.submit);
	app.get('/hints', auth.requiresLogin, Hints.show);
	app.post('/hints/buy', input.sanitize, auth.requiresLogin, Hints.buy);
	app.get('/logout', Logout.show);

	// Team routes.
	app.get('/teams.:format?', Teams.index);
	app.post('/teams.:format?', Teams.create);
	app.get('/teams/new.:format?', Teams.new);
	app.get('/teams/:id.:format?', Teams.show);
	app.get('/teams/:id/edit', Teams.edit);
	app.put('/teams/:id.:format?', Teams.update);
	app.delete('/teams/:id.:format?', Teams.destroy);

	// Admin Routes
	app.get('/admin', auth.requiresLogin, admin.index);

	// Admin Team Routes
	app.get('/admin/teams', auth.requiresLogin, admin_teams.index);
	app.post('/admin/teams', auth.requiresLogin, admin_teams.create);
	app.get('/admin/teams/new', auth.requiresLogin, admin_teams.new);
	app.get('/admin/teams/:id/show', auth.requiresLogin, admin_teams.show);
	app.get('/admin/teams/:id/edit', auth.requiresLogin, admin_teams.edit);
	app.put('/admin/teams/:id', auth.requiresLogin, admin_teams.update);
	app.delete('/admin/teams/:id', auth.requiresLogin, admin_teams.destroy);

	// Admin Users Routes
	app.get('/admin/users', auth.requiresLogin, admin_users.index);
	app.post('/admin/users', auth.requiresLogin, admin_users.create);
	app.get('/admin/users/new', auth.requiresLogin, admin_users.new);
	app.get('/admin/users/:id/show', auth.requiresLogin, admin_users.show);
	app.get('/admin/users/:id/edit', auth.requiresLogin, admin_users.edit);
	app.put('/admin/users/:id', auth.requiresLogin, admin_users.update);
	app.put('/admin/users/:id/password', auth.requiresLogin, admin_users.update_password);
	app.delete('/admin/users/:id', auth.requiresLogin, admin_users.destroy);

	// Admin Hints Routes
	app.get('/admin/hints', auth.requiresLogin, admin_hints.index);
	app.post('/admin/hints', auth.requiresLogin, admin_hints.create);
	app.get('/admin/hints/new', auth.requiresLogin, admin_hints.new);
	app.get('/admin/hints/:id/show', auth.requiresLogin, admin_hints.show);
	app.get('/admin/hints/:id/edit', auth.requiresLogin, admin_hints.edit);
	app.put('/admin/hints/:id', auth.requiresLogin, admin_hints.update);
	app.delete('/admin/hints/:id', auth.requiresLogin, admin_hints.destroy);

	// Admin Tokens Routes
	app.get('/admin/tokens', auth.requiresLogin, admin_tokens.index);
	app.post('/admin/tokens', auth.requiresLogin, admin_tokens.create);
	app.get('/admin/tokens/new', auth.requiresLogin, admin_tokens.new);
	app.get('/admin/tokens/:id/show', auth.requiresLogin, admin_tokens.show);
	app.get('/admin/tokens/:id/edit', auth.requiresLogin, admin_tokens.edit);
	app.put('/admin/tokens/:id', auth.requiresLogin, admin_tokens.update);
	app.delete('/admin/tokens/:id', auth.requiresLogin, admin_tokens.destroy);
	
	// Admin Sponsors Routes
	app.get('/admin/sponsors', auth.requiresLogin, admin_sponsors.index);
	app.post('/admin/sponsors', auth.requiresLogin, admin_sponsors.create);
	app.get('/admin/sponsors/new', auth.requiresLogin, admin_sponsors.new);
	app.get('/admin/sponsors/:id/show', auth.requiresLogin, admin_sponsors.show);
	app.get('/admin/sponsors/:id/edit', auth.requiresLogin, admin_sponsors.edit);
	app.put('/admin/sponsors/:id', auth.requiresLogin, admin_sponsors.update);
	app.delete('/admin/sponsors/:id', auth.requiresLogin, admin_sponsors.destroy);
}
