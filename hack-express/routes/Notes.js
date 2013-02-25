
/*
 * GET Notes page.
 */

exports.show = function(req, res){
  
  //Authenticate with cookies
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return; }
  nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
  
  res.render('Notes');
};

/*
 * Submit Network Notes.
 */

exports.submitNetwork = function(req, res){
  res.render('Notes');
};

/*
 * Submit Credentials Notes.
 */

exports.submitCredentials = function(req, res){
  res.render('Notes');
};

/*
 * Submit Crypto Notes.
 */

exports.submitCrypto = function(req, res){
  res.render('Notes');
};

/*
 * Submit Misc Notes.
 */

exports.submitMisc = function(req, res){
  res.render('Notes');
};