// Create a Node HTTP server that serves up the requested file
// The server accepts 2 query parameters: from and to
// Before sending out the file, change all instance of from in the file to to
// Example: http://localhost:1337/index.html?from=hello&to=bye will change all
// instances of hello in index.html to bye

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var server = http.createServer(handleRequest);
const port = 1337;

function textReplace(from, to, content){
  //replace contents of file from occurences to to
  var words = content.split(' ');
  var count = 0;
  words = words.map(function(elem){
    if ("'"+elem+"'" === from){
      count++;
      return to.slice(1,to.length-1);
    } else {
      return elem;
    }
  })
  console.log('Words replaced: ', count);
  return words.join(' ');
}

function handleRequest(request, response){
    var parsedURL = url.parse(request.url);
    var pathname = parsedURL.pathname;
    var queryString = url.parse(request.url,true).query;
    fs.readFile(path.join('.', pathname), 'utf8', function (err, contents) {
    if (err) {
      response.statusCode = 404
      response.end('404');
      return;
    }
    response.setHeader('Content-Type', 'text/plain')
    if (pathname.endsWith('html')) {
      response.setHeader('Content-Type', 'text/html')
    } else if (pathname.endsWith('js')) {
      response.setHeader('Content-Type', 'text/javascript')
    }
    response.statusCode = 200
    response.end(textReplace(queryString.from, queryString.to, contents));
  })
}

server.listen(port, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", port);
}); 
