
var Registration = require('./routes/Registration'),
	Login = require('./routes/Login'),
	Scoreboard = require('./routes/Scoreboard'),
	Submissions = require('./routes/Submissions'),
	Logout = require('./routes/Logout'),
	auth = require('./auth'),
	cache = require('./cache')
	Teams = require('./routes/teams');

module.exports = function(app) {
	app.get('/', function (req, res) {
  		res.redirect('Scoreboard');
	});

	app.get('/registration', cache.cacheMiddleware, Registration.show);
	app.post('/registration/submit', Registration.submit);
	app.get('/login', cache.cacheMiddleware, Login.show);
	app.post('/login/submit', Login.submit);
	app.get('/scoreboard', cache.cacheMiddleware, Scoreboard.show);
	app.get('/submissions', auth.requiresLogin, cache.cacheMiddleware, Submissions.show);
	app.post('/submissions/submit', auth.requiresLogin, Submissions.submit);
	app.get('/logout', cache.cacheMiddleware, Logout.show);

	// Team routes.
	app.get('/teams', Teams.index);
	app.get('/teams/:id', Teams.show);
	app.get('/teams/:id/edit', Teams.edit);
	app.put('/teams/:id', Teams.update);
	app.delete('/teams/:id');
}
