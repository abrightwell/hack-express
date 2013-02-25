
/*
 * GET users listing.
 */

exports.list = function(req, res){
  
  //Authenticate with cookies
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return; }
  nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
  
  res.send("respond with a resource");
};