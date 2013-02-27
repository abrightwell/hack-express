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
 * GET Scoreboard page.
 */

exports.show = function(req, res){
  
  //Authenticate with cookies
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return; }
  //nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
    
  //Variable used to build the table body which holds user scores
  var userInfo = "<tbody>";
  //Temporary array for holding the split strings
  var temp = "";
  
  //Query DB for users' info
  _users.view('views', 'Scoreboard', function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        //Print to console
        console.log(doc.key);
        //Split user keys into a string array
        temp = doc.key.split(",");
        //Build table rows per user
        userInfo += "<tr><td>"+ "\t" + temp[0] + "\t" + "</td>";
        userInfo += "<td>" + "\t" + "<progress value=\"" + temp[1] + "\" max=\"150\"></progress>" + "\t"+ temp[1] + "\t" + "</td></tr>";
      });
      //Close table
      userInfo += "</tbody>"
      //Render Scoreboard page with populated table
      res.render('Scoreboard', {layout: false, tbod: userInfo });
    }
    else{
      console.log(err);
    }
  });
};

