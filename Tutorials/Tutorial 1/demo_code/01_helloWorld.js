/*
Hello World example to serving string to client
To test use browser to view
http://localhost:3000
Cntl+C to stop server
*/

var http = require('http');
var counter = 1000;

http.createServer(function (request,response){
	console.log("request headers:");
	console.log(request.headers);

   //respond to client
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.write('Hello\n');
   var urlString = request.url;
   var index = urlString.indexOf("?name=");
   if(index > 0) {
   var name = urlString.substring(index + "?name=".length, urlString.length);
   response.write(name + "\n");
  }
 else response.write('World\n');
   //end HTTP response: provide final data and send
   response.end("["+ counter++ + "]\n");
}).listen(3000);

console.log('Server Running at Port 3000  CNTL-C to quit');
console.log('To test with browser visit: http://localhost:3000');
