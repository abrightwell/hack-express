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
var Schema = mongoose.Schema;

var noteSchema = Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	text: {type: String, default: ""}
});

mongoose.model('Note', noteSchema);

module.exports = function(connection) {
	return (connection || mongoose).model('Note');
}
