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

module.exports.sanitize = function(req, res, next) {
	
	//Array of input types to check
	var inputTypes = config.input.types;
	
	//Check request parameters
	for(var i = 0; i<inputTypes.length;i++){
		//If exists, sanitize
		if(req.param(inputTypes[i]) != undefined){
			//logger.log("info", 'Original input:  ' + req.param(inputTypes[i]));
			req.sanitize(inputTypes[i]).trim('\r\n\t ');
			req.sanitize(inputTypes[i]).trim('/\$|\:|,|\{|\}|\[|\]|;|<|>|&+/');
			req.sanitize(inputTypes[i]).trim('/\]+/');
			req.sanitize(inputTypes[i]).escape;
			req.sanitize(inputTypes[i]).xss;
			req.sanitize(inputTypes[i]).xss(true);
			//logger.log("info", 'Sanitized input:  ' + req.param(inputTypes[i]));
		}
	}
	next();
}
