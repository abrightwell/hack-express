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
 * Authors:  Adam Brightwell, Robert Dunigan
 */

var util = require('util');
var jquery = require('jquery');
var fs = require('fs');

var config = {};
var options = {};
var defaults = JSON.parse(fs.readFileSync('./conf/defaults.json'));

if (fs.existsSync('./conf/options.json')) {
	options = JSON.parse(fs.readFileSync('./conf/options.json'));
	config = jquery.extend(true, {}, defaults, options);
} else {
	config = defaults;
}

module.exports = config;
