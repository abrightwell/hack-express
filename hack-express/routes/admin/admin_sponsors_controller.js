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

var database = require('../../database').connection;
var gfs = require('../../database').gfs;
var Sponsor = require('../../model/sponsor')(database);
var upload = require('../../upload');

var fs = require("fs"),
    mongo = require("mongodb"),
    grid = require("gridfs-stream"),
    gridfs,
    writeStream,
    readStream,
    buffer = "";

var per_page = 10;

// GET /admin/sponsors
exports.index = function(req, res) {
	
	var page = parseInt(req.param('page')) || 1;
	var offset = (page - 1) * per_page;

	query = {$query: {}, $orderby: { title: 1 }};
	fields = {};
	options = {'skip': offset, 'limit': per_page};

	Sponsor.find(query, fields, options, function(err, sponsors) {
		if (err) {
			logger.log('error', err);
		} else {
			Sponsor.count(function(err, total) {
				var page_count = (total / per_page);

				locals = {
					'total': total,
					'page_count': page_count,
					'page': page,
					'sponsors': sponsors
				};

				res.render('admin/sponsors/index', locals);
			});
		}
	});
};

// GET /admin/sponsors/new
exports.new = function(req, res) {
	var sponsor = new Sponsor();
	res.render('admin/sponsors/new', {'sponsor': sponsor});
};

// POST /admin/sponsors
exports.create = function(req, res) {
	var sponsor = new Sponsor(req.body);
	
	//Uploads locally to an uploads folder, but does not import into mongodb/gridfs
	upload.image(req, res);
	
	console.log("Gets here too");
	
	//Create GridFS chunks and files within the fs bucket
	//These are connected to the Sponsor Model
	//Save/Stream these to GridFS
	//var options = {
		//filename: sponsor.image
		//};
	var uploadPath = upload.uploadPath + "/images";
	var filename = req.files.image.name;
	var filePath = uploadPath + "/" + filename;
	
	console.log("Gets here three");
	
	//var writeStream = gfs.createWriteStream({ filename: filename });
	//var readStream = fs.createReadStream(filePath).pipe(writeStream);
	
	//readStream.on('error', function (error) {console.log("Caught", error);});
	//readStream.on('readable', function () {readStream.read();});
	
	console.log("Gets here four");
	
	//writeStream.on('error', function (error) {console.log("Caught", error);});
	//writeStream.on('readable', function () {writeStream.write();});
	
	/*
	writeStream.on('close', function () {
		// do something with `file`
		logger.log('info','File successfully stored: ' + filename);
	});
	*/
	
	console.log("Gets here five");
	
	sponsor.save(function(err) {
		if (err) {
			logger.log('error', 'Failed saving new sponsor.');
		} else {
			logger.log('info', "Successfully created new sponsor: " + sponsor._id);
			res.redirect('/admin/sponsors');
		}
	});
};

// GET /admin/sponsors/:id/show
exports.show = function(req, res) {
	var id = req.params.id;

	Sponsor.findById(id, function(err, sponsor) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/sponsors/show', {'sponsor': sponsor});
		}
	});
};

// GET /admin/sponsors/:id/edit
exports.edit = function(req, res) {
	var id = req.params.id;

	Sponsor.findById(id, function(err, sponsor) {
		if (err) {
			logger.log('error', err.reason);
		} else {
			res.render('admin/sponsors/edit', {'sponsor': sponsor});
		}
	});
};

// PUT /admin/sponsors/:id
exports.update = function(req, res) {
	var id = req.params.id;
	var sponsor = req.body;
	
	if(sponsor.revealed===undefined){
		Sponsor.findByIdAndUpdate(id, {$set: sponsor}, function(err, result) {
			if (err) {
				logger.log('error', err);
			} else {
				res.redirect('/admin/sponsors');
			}
		});
	}
};

// DELETE /admin/sponsors/:id
exports.destroy = function(req, res) {
	var id = req.params.id;

	Sponsor.findByIdAndRemove(id, function(err, result) {
		if (err) {
			logger.log('error', err);
		} else {
			res.redirect('/admin/sponsors');
		}
	});
};
