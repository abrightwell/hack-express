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
 *Authors:  Robert Dunigan
 */

winston = require('winston');

module.exports.getLogger = function() {
	var tempLog = new (winston.Logger);
	if(config.log.console){
		tempLog.add(winston.transports.Console, { level: config.log.level, colorize: config.log.color });
	}
	if(config.log.file){
		tempLog.add(winston.transports.File, { level: config.log.level, colorize: config.log.color, filename: config.log.filename, maxsize: config.log.max_size });
	}
    return tempLog;
};
