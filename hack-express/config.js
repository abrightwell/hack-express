var util = require('util')
var config = {};

config.db = {};
config.session = {};
config.session.db = {};
config.redis = {};
config.ssl = {};

config.db.host = 'localhost';
config.db.port = 5984;
config.db.name = 'hack-express';
config.db.user = 'hack-admin';
config.db.password = 'secret';

config.session.db.host = 'localhost';
config.session.db.port = 5984;
config.session.db.ssl = false;
config.session.db.name = 'hack-express-session';
config.session.db.revs_limit = '1000';
config.session.db.username = 'hack-admin';
config.session.db.password = 'secret';

config.redis.host = 'localhost';
config.redis.port = 6379;
config.redis.db = 1;
config.redis.ttl = 30;
config.redis.password = 'secret';

config.ssl.key = './security/hack-express-dev.key';
config.ssl.cert = './security/hack-express-dev.crt';

config.db.connection_string = function() {
	return util.format('http://%s:%s@%s:%d', 
		config.db.user,
		config.db.password,
		config.db.host,
		config.db.port);
}

module.exports = config;
