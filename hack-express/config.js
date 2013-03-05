var config = {};

config.db = {};
config.ssl = {};

config.db.url = 'http://localhost:5984';
config.db.name = 'hack_db';
config.db.user = 'hack-admin';
config.db.password = 'secret';

config.ssl.key = './security/hack-express-dev.key';
config.ssl.cert = './security/hack-express-dev.crt';

module.exports = config;
