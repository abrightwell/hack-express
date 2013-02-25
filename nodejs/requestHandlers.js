var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require('fs');

var css = "<style>" + fs.readFileSync('../hackWarz.css').toString() + "</style><style>" + fs.readFileSync('../tabs.css').toString() + "</style>";

function start(response, postData) {
  console.log("Request handler 'start' was called.");

  /*
  exec("ls -lah", function (error, stdout, stderr) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(stdout);
    response.end();
  });
  */
  
  var html = fs.readFileSync('../Registration.html').toString() + css;
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(html);
  response.end();
  
}

function upload(response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent the text: "+
  querystring.parse(postData).text);
  response.end();
}

exports.start = start;
exports.upload = upload;