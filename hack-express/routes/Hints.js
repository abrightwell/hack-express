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
 * GET Hints page.
 */

exports.show = function(req, res){
  
  //Authenticate with cookies
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return; }
  nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
  
  //Query DB for user's hints
  hack_db.view('views', 'Hints', function(err, body) {
    
    if (!err) {
    
    //Clear tables and start adding rows
      var generalHints = "<tbody>";
      var personalHints = "<tbody>";
      
      //Temporary array for holding the split strings
      var temp = "";
      
      body.rows.forEach(function(doc) {
        //Print to console
        console.log(doc.key);
        
        //Split user keys into a string array
        temp = doc.key.split(",");
        
        console.log(temp[0]);
        console.log(temp[1]);
        
        //Build table rows per hint
        //Must compare as string because of the split method used despite being stored in the database as a boolean value
        //General
        if(temp[0]=="true"){
          generalHints += "<tr><td>"+ temp[1] + "</td></tr>";
          //Personal
        } else{
          personalHints += "<tr><td>"+ temp[1] + "</td></tr>";
        }
      })
      //Close tables
      generalHints += "</tbody>";
      personalHints += "</tbody>";
      
      //Render Hints page with populated tables
      res.render('Hints', {layout: false, tbodGeneral: generalHints, tbodPersonal: personalHints });
      
    } else{
        //Variable used to build the table body which holds general hints
        //Error/Blank table
        var generalHints = "<tbody><tr><td>...</td></tr><tr><td>...</td></tr><tr><td>...</td></tr><tr><td>...</td></tr><tr><td>...</td></tr></tbody>";
        
        //Variable used to build the table body which holds general hints
        //Error/Blank table
        var generalHints = "<tbody><tr><td>...</td></tr><tr><td>...</td></tr><tr><td>...</td></tr><tr><td>...</td></tr><tr><td>...</td></tr></tbody>";
        
        //Render Hints page with empty tables
        res.render('Hints', {layout: false, tbodGeneral: generalHints, tbodPersonal: personalHints });
      }
  })
};

/*
 * Determine if there are enough points and available hints.
 * If invalid
 * Throw ERROR
 * Respond with Hints page and ERROR message
 * Else valid
 * Subtract points
 * Modify hints values in DB
 * Respond with newly unlocked hints on updated Hints page and SUCCESS message
 */

exports.buy = function(req, res){
  //Query DB for pts required and currently non-bought hints
  //If invalid
  //Throw ERROR
  //Respond with Hints page and ERROR message
  //Else valid
  //Subtract points
  //Modify hints values in DB
  //Respond with newly unlocked hints on updated Hints page and SUCCESS message
  // res.render('Hints');
};