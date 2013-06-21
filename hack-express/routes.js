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
	Hints = require('./routes/Hints'),
	Logout = require('./routes/Logout'),
	input = require('./input'),
	auth = require('./auth'),
	cache = require('./cache'),
	Teams = require('./routes/teams_controller');

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
}
