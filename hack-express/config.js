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

var util = require('util')
var config = {};

config.db = {};
config.session = {};
config.session.db = {};
config.redis = {};
config.ssl = {};
config.page = {};

config.db.host = 'localhost';
config.db.port = 6984;
config.db.name = 'hack-express';
config.db.user = 'hack-admin';
config.db.password = 'secret';

config.session.db.host = 'localhost';
config.session.db.port = 6984;
config.session.db.ssl = true;
config.session.db.name = 'hack-express-session';
config.session.db.revs_limit = '1000';
config.session.db.username = 'hack-admin';
config.session.db.password = 'secret';

config.redis.host = 'localhost';
config.redis.port = 6379;
config.redis.db = 1;
config.redis.ttl = 30;
config.redis.password = 'secret';

config.page.refreshTime = 60;

config.ssl.key = './security/hack-express-dev.key';
config.ssl.cert = './security/hack-express-dev.crt';

config.db.connection_string = function() {
	var ssl = config.db.ssl ? 's' : '';
	return util.format('http%s://%s:%s@%s:%d',
		ssl,
		config.db.user,
		config.db.password,
		config.db.host,
		config.db.port);
}

module.exports = config;
