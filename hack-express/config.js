var config = {};

config.db = {};
config.redis = {};
config.ssl = {};

config.db.url = 'http://localhost:5984';
config.db.name = 'hack-express';
config.db.user = 'hack-admin';
config.db.password = 'secret';

config.redis.host = 'localhost';
config.redis.port = 6379;
config.redis.db = 1;
config.redis.ttl = 30;
config.redis.password = 'secret';

config.ssl.key = './security/hack-express-dev.key';
config.ssl.cert = './security/hack-express-dev.crt';

module.exports = config;
