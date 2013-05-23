/*jshint node:true*/
'use strict'
 
var config = require('./config');

var mongoose = require('mongoose'),
	connection = mongoose.createConnection(
	  config.db.host,
	  config.db.name,
	  config.db.port,
	  { server: {ssl: config.db.ssl} }
	);

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function(err, result) {
  console.log('Connection to MongoDB is open.')
});

exports.connection = connection