/*

To test:
Open two browsers at http://localhost:3000/assignment3.html


*/

//CTRL+C 
const http = require("http");
const fs = require("fs");
const url = require("url");
const app = http.createServer(handler);
const io = require("socket.io")(app);

const ROOT_DIR = "html";

const PORT = process.env.PORT || 3000

function handler(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log("\n============================")
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let receivedData = ""

  //attached event handlers to collect the message data
  request.on("data", function(chunk) {
    receivedData += chunk
  })

  request.on("end", function() {
    console.log("REQUEST END: ")
    console.log("received data: ", receivedData)
    console.log("type: ", typeof receivedData)

    //if it is a POST request then echo back the data.
    

    if (request.method == "GET") {
      //handle GET requests as static file requests
      fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
        if (err) {
          //report error to console
          console.log("ERROR: " + JSON.stringify(err))
          //respond with not found 404 to client
          response.writeHead(404)
          response.end(JSON.stringify(err))
          return
        }
        response.writeHead(200, {
          "Content-Type": get_mime(urlObj.pathname)
        })
        response.end(data)
      })
    }
  })
}

app.listen(PORT);

// Model for paddles
var paddle1 = {
  taken : false,
  color : "#444444",
  x : 20,
  y : 150
};

var paddle2 = {
  taken : false,
  color : "#444444",
  x : 770,
  y : 150
};

var paddleWidth = 10;
var paddleHeight = 75;

var puck = {
  x : 400,
  y : 200,
  radius : 7,
  xVelocity : 0,
  yVelocity: 0
};

var puckStart = {
  x: 400,
  y: 200
};

var goalPost1 = {
  taken : false,
  color : "#FF0000",
  x : 2,
  y : 95,
};

var goalPost2 = {
  taken : false,
  color : "#FF0000",
  x : 784,
  y : 95,
};

var goalPostWidth = 15;
var goalPostHeight = 200;

var score_1 = 0;
var score_2 = 0;
var checkGoal1 = false;
var checkGoal2 = false;

flag = true;
// To tell clients about position constantly
setInterval(()=>{

  // Move the puck based on its velocity
  //if(flag){
	puck.x += puck.xVelocity;
	puck.y += puck.yVelocity;
	//flag=false;
  //}

  // If the puck is "inside" a paddle, it collides

  // Check for collision with paddle1
	if(puck.y >=paddle1.y && puck.y <= paddle1.y + paddleHeight  && (
      (puck.x - puck.radius <= paddle1.x + paddleWidth && puck.x - puck.radius >= paddle1.x) ||
      (puck.x + puck.radus >= paddle1.x && puck.x + puck.radius <= paddle1.x + paddleWidth)
    )){
	  puck.xVelocity = -puck.xVelocity;

    // Move the puck slightly to ensure it doesn't get hit again by the paddle
    puck.x += 1.5*puck.xVelocity;
  }

  // Check for collision with paddle2
  if(puck.y >=paddle2.y && puck.y <= paddle2.y + paddleHeight  && (
      (puck.x - puck.radius <= paddle2.x + paddleWidth && puck.x - puck.radius >= paddle2.x) ||
      (puck.x + puck.radus >= paddle2.x && puck.x + puck.radius <= paddle2.x + paddleWidth)
    )){
    puck.xVelocity = -puck.xVelocity;

    // Move the puck slightly to ensure it doesn't get "stuck" inside the paddle
    puck.x += 1.5*puck.xVelocity;
  }


  //Check for Edge Collision:
  if( puck.y - puck.radius <= 0){
	  puck.yVelocity = -puck.yVelocity;
  }
  if(puck.y + puck.radius >= 400){
	  puck.yVelocity = -puck.yVelocity;
  }
  if(puck.x - puck.radius <= 0){
	  puck.xVelocity = -puck.xVelocity;
  }
  if(puck.x + puck.radius >= 800){
	  puck.xVelocity = -puck.xVelocity;
  }
  
// Scoreboard
  if((puck.x >= 0 && puck.x <= (goalPost1.x + goalPostWidth)) &&
	(puck.y >= goalPost1.y && puck.y <= (goalPost1.y + goalPostHeight)) && (!checkGoal1)){
		
		score_2++;
		checkGoal1 = true;
	}else if((puck.x > goalPost1.x + goalPostWidth) && (puck.x < goalPost2.x)){
		checkGoal1 = false;
	}
	
  if((puck.x >= goalPost2.x && puck.x <= 800) &&
	(puck.y >= goalPost2.y && puck.y <= (goalPost2.y + goalPostHeight)) && (!checkGoal2)){
		
		score_1++;
		checkGoal2 = true;
	}else if((puck.x > goalPost1.x + goalPostWidth) && (puck.x < goalPost2.x)){
		//console.log("set to false"); 
		checkGoal2 = false;
	}
  //console.log(score_1);
  //console.log(score_2);
  // Tell the clients about the position
  var data = {paddle1: paddle1, paddle2: paddle2, puck: puck, score_1: score_1, score_2: score_2};
  io.emit("positionData", JSON.stringify(data));
},25);


io.on('connect', (socket)=> {
  console.log("new connection");

  // For initialization
  socket.on('initialSetup', ()=>{
    data = {
      puck : puck,
      paddle1: paddle1,
      paddle2: paddle2
    };
    // Send data to socket if that requested only
    socket.emit('initialSetup', JSON.stringify(data));
  });

  socket.on("positionData", (positionData)=>{
    var data = JSON.parse(positionData);

    if (data.paddle == "paddle1") {
      paddle1.x = data.x;
      paddle1.y = data.y;
    } else {
      paddle2.x = data.x;
      paddle2.y = data.y;
    }
  });

  socket.on('playerRegister', (reply)=>{
    var respData = JSON.parse(reply);

    var data = "";

    // Check if they can get their request
    if (respData == "paddle1" && paddle1.taken == false) {

      // Give them the left paddle
      paddle1.taken = true;
      paddle1.color = "Blue";
      data = {claimStatus: "paddle1", paddle: paddle1};

      // If paddle1 is also taken now, start the game
      if (paddle2.taken == true) {
        puck.xVelocity = -5;
        puck.yVelocity = -5;
      }
    } else if (respData == "paddle2" && paddle2.taken == false) {

      // Give them the right paddle
      paddle2.taken = true;
      paddle2.color = "Blue";
      data = {claimStatus: "paddle2", paddle: paddle2};

      // If paddle1 is also taken now, start the game
      if (paddle1.taken == true) {
        puck.xVelocity = -5;
        puck.yVelocity = -5;
      }
    } else {
      data = {claimStatus: "paddlesTaken"};
    }

    // Tell the client which paddle they got
    socket.emit('playerRegister', JSON.stringify(data));
  });
});


const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
};

function get_mime(filename) {
  let ext, type
  for (let ext in MIME_TYPES) {
    type = MIME_TYPES[ext]
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type
    }
  }
  return MIME_TYPES["txt"]
}

console.log("Server Running at PORT: 3000  CNTL-C to quit");
console.log("To Test: open several browsers at: http://localhost:3000/assignment3.html")