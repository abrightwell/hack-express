
/*
 * GET home page.
 */

exports.index = function(req, res){
  
  //Authenticate with cookies
  var auth = req.cookies['AuthSession'], nano;
  //Redirect to Login page
  if (!auth) { res.redirect('Login'); return; }
  nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
  
  //res.render('index', { title: 'Express' });
  
  //Redirect to the Main page
  res.redirect('Main');
};