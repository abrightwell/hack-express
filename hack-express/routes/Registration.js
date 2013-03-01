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
 * GET Registration page.
 */

exports.show = function(req, res){
  res.render('Registration');
};

/*
 * Submit Registration.
 * Attempt to create user in DB.
 * If successful, render Registration page with SUCCESS.
 * Else render page with ERROR.
 */

exports.submit = function(req, res){
  
  //User credentials to be created
  var user = req.param("userName");
  var pass = req.param("password");
    
  _users.insert({
    
    "_id": "org.couchdb.user:"+user,
    "name": user,
    "password": pass,
    "roles": [],
    "totalPoints": 0,
    "type": "user",
    "tokens": [
   {
       "id": "0",
       "unlocked": false
   },
   {
       "id": "1",
       "unlocked": false
   },
   {
       "id": "2",
       "unlocked": false
   },
   {
       "id": "3",
       "unlocked": false
   },
   {
       "id": "4",
       "unlocked": false
   },
   {
       "id": "5",
       "unlocked": false
   },
   {
       "id": "6",
       "unlocked": false
   },
   {
       "id": "7",
       "unlocked": false
   },
   {
       "id": "8",
       "unlocked": false
   },
   {
       "id": "9",
       "unlocked": false
   },
   {
       "id": "10",
       "unlocked": false
   },
   {
       "id": "11",
       "unlocked": false
   },
   {
       "id": "12",
       "unlocked": false
   },
   {
       "id": "13",
       "unlocked": false
   },
   {
       "id": "14",
       "unlocked": false
   },
   {
       "id": "15",
       "unlocked": false
   },
   {
       "id": "16",
       "unlocked": false
   },
   {
       "id": "17",
       "unlocked": false
   },
   {
       "id": "18",
       "unlocked": false
   },
   {
       "id": "19",
       "unlocked": false
   },
   {
       "id": "20",
       "unlocked": false
   },
   {
       "id": "21",
       "unlocked": false
   },
   {
       "id": "22",
       "unlocked": false
   },
   {
       "id": "23",
       "unlocked": false
   },
   {
       "id": "24",
       "unlocked": false
   },
   {
       "id": "25",
       "unlocked": false
   },
   {
       "id": "26",
       "unlocked": false
   },
   {
       "id": "27",
       "unlocked": false
   },
   {
       "id": "28",
       "unlocked": false
   },
   {
       "id": "29",
       "unlocked": false
   },
   {
       "id": "30",
       "unlocked": false
   },
   {
       "id": "31",
       "unlocked": false
   },
   {
       "id": "32",
       "unlocked": false
   },
   {
       "id": "33",
       "unlocked": false
   },
   {
       "id": "34",
       "unlocked": false
   },
   {
       "id": "35",
       "unlocked": false
   },
   {
       "id": "36",
       "unlocked": false
   },
   {
       "id": "37",
       "unlocked": false
   },
   {
       "id": "38",
       "unlocked": false
   },
   {
       "id": "39",
       "unlocked": false
   },
   {
       "id": "40",
       "unlocked": false
   },
   {
       "id": "41",
       "unlocked": false
   },
   {
       "id": "42",
       "unlocked": false
   },
   {
       "id": "43",
       "unlocked": false
   },
   {
       "id": "44",
       "unlocked": false
   },
   {
       "id": "45",
       "unlocked": false
   },
   {
       "id": "46",
       "unlocked": false
   },
   {
       "id": "47",
       "unlocked": false
   },
   {
       "id": "48",
       "unlocked": false
   },
   {
       "id": "49",
       "unlocked": false
   }
]
  }, function(err, body) {
    if (err)
    res.send("The Force is WEAK with this one!!!!");
    else
    res.redirect('Login');
    });
};