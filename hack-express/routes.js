
var Registration = require('./routes/Registration'),
	Login = require('./routes/Login'),
	Scoreboard = require('./routes/Scoreboard'),
	Submissions = require('./routes/Submissions'),
	Logout = require('./routes/Logout'),
	auth = require('./auth');

module.exports = function(app) {
	app.get('/', function (req, res) {
  		res.redirect('Scoreboard');
	});

	app.get('/registration', Registration.show);
	app.post('/registration/submit', Registration.submit);
	app.get('/login', Login.show);
	app.post('/login/submit', Login.submit);
	app.get('/scoreboard', Scoreboard.show);
	app.get('/submissions', auth.requiresLogin, Submissions.show);
	app.post('/submissions/submit', auth.requiresLogin, Submissions.submit);
	app.get('/logout', Logout.show);
}