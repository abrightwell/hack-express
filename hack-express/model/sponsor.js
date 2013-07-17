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
 * Author: Adam Brightwell, Robert Dunigan
 */

var mongoose = require('mongoose');
//var grid = require('gridfs-stream');
var Schema = mongoose.Schema;

var sponsorSchema = Schema({
	name: {type: String, default: ""},
	image: {type: String, default: ""},
	weight: {type: Number, default: 0}
});

mongoose.model('Sponsor', sponsorSchema);

module.exports = function(connection) {
	return (connection || mongoose).model('Sponsor');
}
