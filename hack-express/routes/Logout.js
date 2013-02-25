
/*
 * Close session.
 * GET Logout page.
 */

exports.show = function(req, res){
  //Close session
  // The CouchDB cookie name is AuthSession
  res.clearCookie('AuthSession');
  res.render('Logout');
};