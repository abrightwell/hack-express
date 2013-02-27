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
 *Web DB Example Code
 */

var hackWarz = {};
hackWarz.webdb = {};
hackWarz.webdb.db = null;

hackWarz.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  hackWarz.webdb.db = openDatabase("HackWarz", "1.0", "HackWarz DB", dbSize);
}

hackWarz.webdb.createTable = function() {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS users(ID INTEGER PRIMARY KEY ASC, userName TEXT, password TEXT, added_on DATETIME, score INTEGER)", []);
  });
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS tokens(ID INTEGER PRIMARY KEY ASC, tokenName TEXT, tokenValue TEXT, pointValue INTEGER)", []);
  });
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS hints(ID INTEGER PRIMARY KEY ASC, hintName TEXT, hintValue TEXT, free BOOLEAN, pointValue INTEGER, revealed BOOLEAN)", []);
  });
}

hackWarz.webdb.register = function(userName, password, score) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx){
    var addedOn = new Date();
    tx.executeSql("INSERT INTO users(userName, password, added_on, score) VALUES (?,?,?,?)",
        [userName, password, addedOn, score],
        hackWarz.webdb.registerOnSuccess,
        hackWarz.webdb.registerOnError);
   });
}

hackWarz.webdb.login = function(userName, password) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("SELECT userName, password FROM users WHERE userName==? AND password==?",
        [userName, password],
        hackWarz.webdb.logOnSuccess,
        hackWarz.webdb.logOnError);
   });
}

hackWarz.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

hackWarz.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  hackWarz.webdb.getAllItems(loadItems);
}

hackWarz.webdb.UserOnSuccess = function(tx, r) {
  // re-render the data.
  hackWarz.webdb.getAllScores(loadScoreboard);
}

hackWarz.webdb.TokenOnSuccess = function(tx, r) {
  // re-render the data.
  hackWarz.webdb.getAllTokens(loadTokens);
}

hackWarz.webdb.HintOnSuccess = function(tx, r) {
  // re-render the data.
  hackWarz.webdb.getAllHints(loadHints);
}

hackWarz.webdb.registerOnError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

hackWarz.webdb.registerOnSuccess = function(tx, r) {
  // re-render the data.
  // hackWarz.webdb.getAllItems(loadItems);
  // window.location = ("Main.html");
}

hackWarz.webdb.logOnError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

hackWarz.webdb.logOnSuccess = function(tx, r) {
  // forward into site.
  window.location = ("Main.html");
}

hackWarz.webdb.deleteUser = function(id) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM users WHERE ID=?", [id],
        hackWarz.webdb.UserOnSuccess,
        hackWarz.webdb.onError);
    });
}

hackWarz.webdb.deleteToken = function(id) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM tokens WHERE ID=?", [id],
        hackWarz.webdb.TokenOnSuccess,
        hackWarz.webdb.onError);
    });
}

hackWarz.webdb.deleteHint = function(id) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM hints WHERE ID=?", [id],
        hackWarz.webdb.HintOnSuccess,
        hackWarz.webdb.onError);
    });
}

/*aBOVE*/

hackWarz.webdb.getAllScores = function(renderFunc) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM users", [], renderFunc,
        hackWarz.webdb.onError);
  });
}

hackWarz.webdb.getAllTokens = function(renderFunc) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM tokens", [], renderFunc,
        hackWarz.webdb.onError);
  });
}

hackWarz.webdb.getAllHints = function(renderFunc) {
  var db = hackWarz.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM hints", [], renderFunc,
        hackWarz.webdb.onError);
  });
}

function loadScoreboard(tx, rs) {
  var rowOutput = "";
  var items = document.getElementById("items");
  for (var i=0; i < rs.rows.length; i++) {
    rowOutput += renderScoreboard(rs.rows.item(i));
  }

  items.innerHTML = rowOutput;
}

function loadTokens(tx, rs) {
  var rowOutput = "";
  var items = document.getElementById("items");
  for (var i=0; i < rs.rows.length; i++) {
    rowOutput += renderTokens(rs.rows.item(i));
  }

  items.innerHTML = rowOutput;
}

function loadHints(tx, rs) {
  var rowOutput = "";
  var items = document.getElementById("items");
  for (var i=0; i < rs.rows.length; i++) {
    rowOutput += renderHints(rs.rows.item(i));
  }

  items.innerHTML = rowOutput;
}

function renderScoreboard(row) {
  return "<li>" + row.userName + "\t" + row.score + " [<a href='javascript:void(0);'  onclick='hackWarz.webdb.deleteUser(" + row.ID +");'>Delete</a>]</li>";
}

function renderTokens(row) {
  return "<li>" + row.tokenName + "\t" + row.tokenValue + "\t" + row.pointValue + " [<a href='javascript:void(0);'  onclick='hackWarz.webdb.deleteToken(" + row.ID +");'>Delete</a>]</li>";
}

function renderHints(row) {
  return "<li>" + row.hintName + "\t" + row.hintValue + "\t" + row.free + "\t" + row.pointValue + "\t" + row.revealed + " [<a href='javascript:void(0);'  onclick='hackWarz.webdb.deleteHint(" + row.ID +");'>Delete</a>]</li>";
}

function initScoreboard() {
  hackWarz.webdb.open();
  hackWarz.webdb.createTable();
  hackWarz.webdb.getAllScores(loadScoreboard);
}

function initTokens() {
  hackWarz.webdb.open();
  hackWarz.webdb.createTable();
  hackWarz.webdb.getAllTokens(loadTokens);
}

function initHints() {
  hackWarz.webdb.open();
  hackWarz.webdb.createTable();
  hackWarz.webdb.getAllHints(loadHints);
}

function init() {
  hackWarz.webdb.open();
  hackWarz.webdb.createTable();
}

function register() {
  var userName = document.getElementById("userName");
  var password = document.getElementById("password");
  var score = 0;
  hackWarz.webdb.register(userName.value, password.value, score);
  userName.value = "";
  password.value = "";
}

function login() {
  var userName = document.getElementById("userName");
  var password = document.getElementById("password");
  hackWarz.webdb.login(userName.value, password.value);
  userName.value = "";
  password.value = "";
}