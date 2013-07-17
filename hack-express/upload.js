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

var config = require('./config');
var fs = require('fs');

exports.image = function(req, res){
	
	fs.readFile(req.files.image.path, function (err, data) {
		
		if(err){
			console.log(err);
		} else {
						
			var uploads = __dirname + "/uploads";
			var images = __dirname + "/uploads/images";
			var filename = req.files.image.name;
			var filePath = images + '/' + filename;
			
			//Check uploads
			var uploadsExists = fs.existsSync(uploads);
			if(uploadsExists){
					//No action required
				} else {
					fs.mkdirSync(uploads);
					logger.log('info','Directory created: ' + uploads);
				}
			
			//Check images
			var imagesExists = fs.existsSync(images);
			if(imagesExists){
					//No action required
				} else {
					fs.mkdirSync(images);
					logger.log('info','Directory created: ' + images);
				}
			//Write file to './uploads/images'
			fs.writeFileSync(filePath, data);
		}
	});
}

exports.uploadPath = __dirname + "/uploads";
