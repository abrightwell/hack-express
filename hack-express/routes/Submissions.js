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
 *
 *Note:  This code needs major refactoring...It is sloppy at the moment, but it works.
 */

/*
 * GET Submissions page.
 */

exports.show = function(req, res){
  
  //Authenticate with cookies
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return; }
  nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
  
  //Variable used to build the table body which holds user tokens
  var tokenInfo = "<tbody>";
  //Temporary array for holding the split strings
  var temp = "";
  
  //Get cookie  !!!!!
  nano.db.get('_session', function(err, body) {
  if (!err) {
    console.log("User Input:");
    //Extract User ID from Cookie
    cookieName = body.userCtx.name;
    console.log(cookieName);
    
    //Find user
    //Query DB for user's info
    _users.view('views', 'Users', {"name": cookieName}, function(err, body) {
      if (!err) {
        body.rows.forEach(function(doc) {
          //Print to console
          console.log(doc.key);
          
          if(doc.key.name==cookieName){
            console.log("Found it!...");
            console.log("********************************************");
            console.log(doc);
            console.log("********************************************");
            
            //Get user doc ref
            userDoc = doc.key;//added .key
            
            //Find tokens
            //Query DB for tokens info
            hack_db.view('views', 'Tokens', function(err, body) {
              if (!err) {
                //Find
                body.rows.forEach(function(doc) {
                  //Print to console
                  console.log(doc.key);
                  //Split user keys into a string array
                  //Get Token Doc ID
                  temp = doc.key.split(",");
                  console.log(temp);
                  if (userDoc.tokens[temp[0]].unlocked==true){
                    //Build/Append HTML Table
                    //Build table rows per token
                    tokenInfo += "<tr><td>"+ "\t" + temp[2] + "\t" + "</td>";
                    tokenInfo += "<td>"+ "\t" + temp[1] + "\t" + "</td>";
                    tokenInfo += "<td>"+ "\t" + temp[3] + "\t" + "</td></tr>";
                    console.log("*******************************************************************");
                    console.log(tokenInfo);
                    console.log("*******************************************************************");
                  } else {
                    //Nothing
                  }
                });
                //Close table
                tokenInfo += "</tbody>"
                console.log("*******************************************************************");
                console.log(tokenInfo);
                console.log("*******************************************************************");
                res.render('Submissions', {layout: false, tbod: tokenInfo });
              }
            });
            
            
            //Call from here
            
            
            } else {
              //Nothing..keep moving
              }
        });
      } else{
        console.log(err);
        }
    });
  } else {
    //Nothing..keep moving
    }
  });
  //res.render('Submissions', {layout: false, tbod: tokenInfo });
};



/*
 * Submit Token.
 */

exports.submit = function(req, res){
  
  //Authenticate with cookies
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return; }
  nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
  
  //Get cookie  !!!!!
  nano.db.get('_session', function(err, body) {
  if (!err) {
    console.log("User Input:");
    //Extract User ID from Cookie
    cookieName = body.userCtx.name;
    console.log(cookieName);
    //Extract Token Value from Request
    userTokenValue = req.param("tokenID");;
    console.log(userTokenValue);
    
      //Query DB for token info
  hack_db.view('views', 'Tokens', {"value": userTokenValue}, function(err, body) {
    if (!err) {
      //Find a matching token
      body.rows.forEach(function(doc) {
        //Print to console
        console.log(doc.key);
        //Split token keys into a string array
        tempToken = doc.key.split(",");
        if(userTokenValue === tempToken[2]){
          console.log("Found it!..." + tempToken[2]);
          //Extract Token Info
          tokenNum = tempToken[0];
          tokenValue = tempToken[2];
          tokenPoints = parseInt(tempToken[3]);
          console.log("Real Info:");
          console.log("********************************************");
          console.log(tokenNum);
          console.log(tokenValue);
          console.log(tokenPoints);
          console.log("********************************************");
          
          //Find user
            //Query DB for user's info
            _users.view('views', 'Users', {"name": cookieName}, function(err, body) {
              if (!err) {
                body.rows.forEach(function(doc) {
                  //Print to console
                  console.log(doc.key);
                  
                  if(doc.key.name==cookieName){
                    console.log("Found it!...");
                    console.log("********************************************");
                    console.log(doc);
                    console.log("********************************************");
                    
                    //Get two copies
                    oldDoc = doc.key;//added .key
                    newDoc = oldDoc;
                    
                    //Compare old value for possible unlocking and added points
                    if(oldDoc.tokens[tokenNum].unlocked==false){
                      //Set new true value
                      newDoc.tokens[tokenNum].unlocked=true;
                      //Get Total Points, Set Total Points
                      totalPoints = parseInt(newDoc.totalPoints) + tokenPoints;
                      newDoc.totalPoints=totalPoints;
                      console.log("New Stuff?!?!...");
                      console.log("********************************************");
                      console.log(newDoc);
                      console.log("********************************************");
                      console.log(eval(newDoc));
                      console.log("********************************************");
                      
                      console.log("this is the doc key...");
                      console.log(newDoc._id);
                    }
                    //Attempts
                    tried=0;
                    
                    //Call from here
                    test = insert_doc(newDoc, tried);
                    console.log("Updated score...");
                    
                  } else {
                    //Nothing..keep moving
                  }
                  });
                }
                else{
                  console.log(err);
                  }
                  });
        } else {
          //Nothing..keep moving
        }
      });
    }
    else{
      console.log(err);
    }
  });
  } else{
    console.log(err);
  }
});
  res.render('Submissions');  
};

//Update Token Array and totalPoints for User
function insert_doc(mydoc, tried) {
  _users.insert(mydoc, mydoc._id, update);
  }
  
  function update(err, http_body, http_header) {
    if (err) {
      if (err.error === 'conflict' && tried < 1) {
        // get record _rev and retry
        return db.get(mydoc._id, function (err, doc) {
          mydoc._rev = doc._rev;
          insert_doc(mydoc, tried + 1);
          });
        }
      }
      return http_body;
    }