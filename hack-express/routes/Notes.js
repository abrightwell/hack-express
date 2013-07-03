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

var database = require('../database').connection,
    User = require('../model/user')(database),
    Token = require('../model/token')(database),
    Hint = require('../model/hint')(database),
    Note = require('../model/note')(database),
    ObjectId = require('mongodb').ObjectId;

/**
 * Display the notes page with the users submitted notes.
 */
exports.show = function(req, res) {
	var userId = req.session.user._id;
	
	User.findById(userId)
	.populate('notes')
	.exec(function(err, user) {
		if (err) {
			console.log(err);
		} else {
			res.render('Notes', {notes: user.notes});//This will need to be changed to reflect teams
		}
	});
};

exports.submit = function(req, res){
	var noteValue = req.param("noteInput");
	var userId = req.session.user._id;
	
	User.findById(userId)
	.populate('notes')
	.exec(function(err, user) {
		if (err) {
			console.log(err);
		} else {
			
			//Get note id and current text value
			var noteId = user.notes[0].id;
			var noteText = user.notes[0].text;
			
			//Append new notes to current text value
			noteValue = noteText + '\r\n' + noteValue;
			
			//Update note text value
			Note.findByIdAndUpdate(noteId, {$set: {text: noteValue}}, function(err, result) {
				if (err) {
					logger.log('error', err);
				} else {
					res.redirect('/notes');
				}
			});
		}
	});
};
