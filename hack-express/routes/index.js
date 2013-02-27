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