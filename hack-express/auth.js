module.exports.authenticate = function(username, password, callback) {
  hack_db.view('users', 'by_username', {key: username}, function(err, body) {
    user = body.rows[0].value;
    
    if (user) {
      console.log(user);
      if (user.password == password) {
        callback(user);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

/**
 * Function to enforce login on routes requiring protection.
 */
module.exports.requiresLogin = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login?redir=' + req.url);
  }
}