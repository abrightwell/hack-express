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
 *Authors:  Adam Brightwell
 */

/*jshint node:true*/
'use strict'
 
var config = require('./config');

var mongoose = require('mongoose'),
	connection = mongoose.createConnection(
		config.db.host,
		config.db.name,
		config.db.port,
		{ 
			server: {
				poolSize: config.db.poolSize,
				ssl: config.db.ssl
			}
		}
	);

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function(err, result) {
	if (err) {
		logger.log('error', 'Error connection to database.')
	} else {
		logger.log("info", 'Connection to MongoDB is open.')
	}
});

exports.connection = connection
