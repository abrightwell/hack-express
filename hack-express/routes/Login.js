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