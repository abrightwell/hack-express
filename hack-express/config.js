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

config.cache = {};
config.db = {};
config.session = {};
config.session.db = {};
config.redis = {};
config.ssl = {};
config.page = {};
config.log = {};
config.name = {};
config.input = {};

config.cache.secure = true;
config.cache.max_age = 31536000000; //miliseconds, 1yr, Static files
config.cache.min_age = 15; //seconds, 0.25min, Public pages

config.db.host = 'hack-express-db';
config.db.port = 27017;
config.db.ssl = true;
config.db.poolSize = 5;
config.db.name = 'hack-express';
config.db.user = 'hack-admin';
config.db.password = 'secret';

config.session.db.host = 'hack-express-db';
config.session.db.port = 27017;
config.session.db.ssl = false;
config.session.db.name = 'hack-express-sessions';
config.session.db.revs_limit = '1000';
config.session.db.username = 'hack-admin';
config.session.db.password = 'secret';

config.ssl.key = './security/hack-express-dev.key';
config.ssl.cert = './security/hack-express-dev.crt';

config.page.refreshTime = 60; //seconds, 1min

config.log.color = true;
config.log.console = true;
config.log.file = true;
config.log.filename = './logs/hack-express.log';
config.log.level = 'debug';
config.log.max_size = 8192; //bytes

config.name.max_length = 25;

config.input.types = new Array("username", "password", "confirm", "tokenID");

config.db.connection_string = function() {
	var ssl = config.session.db.ssl ? 's' : '';
	return util.format('http%s://%s:%s@%s:%d',
		ssl,
		config.db.user,
		config.db.password,
		config.db.host,
		config.db.port);
}

module.exports = config;
