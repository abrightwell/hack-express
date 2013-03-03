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
 * GET Submissions page.
 */
exports.show = function(req, res){
  
  //Authenticate with cookies
  nano = authenticate(req);
  
  res.render('Submissions');
};

/*
 * Submit Token.
 */
exports.submit = function(req, res){
  
  //Authenticate with cookies
  //Needs access to _users, so don't create a nano var
  authenticateUsers(req);
  
  //Get cookie and user input
  var cookieName = getCookie(req, nano);
  //console.log(cookieName);
  var userTokenValue = getUserTokenValue(req);
  //console.log(userTokenValue);
  
  //Query DB for token info
  var tokenInfoArray = new Array();
  tokenInfoArray = getTokenInfo(userTokenValue);
  
  console.log("Before");
  
  console.log(tokenInfoArray.length);
  
  for(var i=0;i<tokenInfoArray.length;i++){
    console.log(tokenInfoArray[i]);
  }
  
  console.log("After");
  
  //tokenNum = tokenInfoArray[0];
  //tokenValue = tokenInfoArray[1];
  //tokenPoints = tokenInfoArray[2];
  
  //Query DB for user info
  var userInfoArray = new Array();
  userInfoArray = getUserInfo(cookieName);
  
  //id = userInfoArray[0];
  //rev = userInfoArray[1];
  //name = userInfoArray[2];
  //roles = userInfoArray[3];
  //totalPoints = userInfoArray[4];
  //type = userInfoArray[5];
  //pass = userInfoArray[6];
  //salt = userInfoArray[7];
  
  //Get Total Points
  var totalPoints = getTotalPoints(tokenInfoArray[2], parseInt(userInfoArray[4]));
    
  //Create User JSON Doc
  var mydoc = {
    "_id": userInfoArray[0],
    "_rev": userInfoArray[1],
    "name": userInfoArray[2],
    "roles": [userInfoArray[3]],
    "totalPoints": totalPoints,
    "type": userInfoArray[5],
    "password_sha": userInfoArray[6],
    "salt": userInfoArray[7],
    "tokens": {
      tokenNum: {
        "unlocked": true
        }
      }
    }
    
    //Set the User Doc Rev Number to update
    mydoc.doc_key = userInfoArray[0];
    //console.log("this is the doc key...");
    //console.log(mydoc.doc_key);
    
    //Attempts
    var tried = 0;
    
    //Update User Info
    var update = insert_doc(mydoc, tried);
    console.log("Updated score...");
    
    res.render('Submissions');  
};

//Authenticate with cookies
function authenticate(req){
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return null; }
  nano = require('nano')({ url : 'https://localhost:6984', cookie: 'AuthSession=' + auth });
  return nano;
}

function authenticateUsers(req){
  var auth = req.cookies['AuthSession'], nano;
  if (!auth) { res.send(401); return; }
}

//Get cookie
function getCookie(req, nano){
  var name = nano.db.get('_session', cookie);
  return name;
}

function cookie(err, body) {
    if (!err) {
      //Extract User ID from Cookie
      cookieName = body.userCtx.name;
      //console.log(cookieName);
      return cookieName;
    } else {
      return err;
    }
  }

//Get user token value
function getUserTokenValue(req){
  //Extract Token Value from Request
  var value = req.param("tokenID");
  return value;
}

function getTokenInfo(userTokenValue){
  var temp = new Array();
  
  console.log("this is a test of what is being passed in...");
  console.log(userTokenValue);
  
  temp = hack_db.view('views', 'Tokens', function(err, body) {
    if(!err){
      var temp2 = new Array();
      temp2 = body.rows.forEach (function(doc){
        console.log("test");
        console.log(doc);
        temp = doc.key.split(",");
        if(userTokenValue == temp[2]){
          console.log("Value found?");
          console.log(userTokenValue);
          console.log(temp[2]);
          return temp;
        } else {
          return null;
        }
        });
    } else {
      console.log(err);
    }
    return temp;
    });
  
  console.log("outside, returning...");
  console.log(temp[2]);
  return temp;
  }

function getUserInfo(name){
  var temp = new Array();
  
  var doc;
  
  _users.get('org.couchdb.user:'+name, function(err, body){
    if(!err){
      console.log(body);
      
    }
    return;
  });
  
  console.log("GET USER INFO!!!!!!!!!!!!");
  console.log(doc);
  
  /*
  _users.view('views', 'UsersRev', {"name": name}, function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        console.log("test 2");
        console.log(doc.key);
        //Split user keys into a string array
        temp = doc.key.split(",");
        if(name == temp[2]){
          console.log("Value found?");
          console.log(name);
          console.log(temp[2]);
          return;
        }
      });
    }
    return temp;
  });
  */
  
  console.log("outside 2, returning...");
  console.log(temp[2]);
  return temp;
}

//Get Total Points
function getTotalPoints(tokenPoints, userPoints){
  var totalPoints = tokenPoints + userPoints;
  return totalPoints;
}

//Update Token Array and totalPoints for User
function insert_doc(mydoc, tried) {
  _users.insert(mydoc, mydoc._id, update);
}
  
function update(err, http_body, http_header) {
  if (err) {
    if (err.error == 'conflict' && tried < 1) {
      // get record _rev and retry
      return db.get(mydoc._id, function (err, doc) {
        mydoc._rev = doc._rev;
        insert_doc(mydoc, tried + 1);
        });
      }
    }
    return http_body;
  }