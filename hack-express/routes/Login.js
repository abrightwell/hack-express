
/*
 * GET Login page.
 */

exports.show = function(req, res){
  res.render('Login');
};

/*
 * Submit Login.  If successful, goto Main page.
 * Else render Login page with ERROR.
 */

exports.submit = function(req, res){
  //Query DB
  //If invalid
  //Throw ERROR
  //Respond with Login and ERROR message
  //Else valid
  //Respond with Main
  // res.render('Main');
  
  //User credentials to be created
  var user = req.param("userName");
  var pass = req.param("password");
  
  nano.request({
        method: "POST",
        db: "_session",
        form: { name: user, password: pass },
        content_type: "application/x-www-form-urlencoded; charset=utf-8"
    },
    function (err, body, headers) {
        if (err) { res.send(err.reason); return; }

        // Send CouchDB's cookie right on through to the client
        if (headers && headers['set-cookie']) {
            res.cookie(headers['set-cookie']);
        }
        
        //Send user to main page
        console.log('Welcome '+ user +' !!!!');
        res.redirect('Main');
    });
};