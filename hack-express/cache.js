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

//Forward headers for Nginx
module.exports.forward = function(req, res, next) {
     if(config.cache.secure){
		 req.forwardedSecure = req.headers["x-forwarded-proto"] === "https";
	 } else {
		 req.forwarded = req.headers["x-forwarded-proto"] === "http";
	 }
     return next();
   }

module.exports.setHeaderPublic = function(req, res, next) {
	logger.log("info", 'Set Cache-Control:  Public');
    res.setHeader("Cache-Control", "public, max-age=" + config.cache.minAge.toString());
    next();
};
