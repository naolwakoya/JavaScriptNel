/*

Javasript to handle mouse dragging and release
to drag a string around the html canvas
Keyboard arrow keys are used to move a moving box around
(The mouse co-ordinates are wrong if the canvas is scrolled with scroll bars.
 Exercise: can you fix this?)

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM element is just the canvas on which
where are drawing.

This example shows examples of using JQuery
JQuery syntax:
$(selector).action();
e.g.
$(this).hide() - hides the current element.
$("p").hide() - hides all <p> elements.
$(".test").hide() - hides all elements with class="test".
$("#test").hide() - hides the element with id="test".

Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers

Keyboard keyDown handler is being used to move a "moving box" around

Notice in the .html source file there are no pre-attached handlers.
*/

//Use javascript array of objects to represent words and their locations

// Air Hockey Board
base_image = new Image();
base_image.src = 'image/airhockeyboard.jpg';

var paddle1 = {
  taken : false,
  color : "#444444",
  x : 20,
  y : 150,
  xMin: 0,
  yMin: 0,
  xMax: 400,
  yMax: 400
};

var paddle2 = {
  taken : false,
  color : "#444444",
  x : 770,
  y : 150,
  xMin: 400,
  yMin: 0,
  xMax: 650,
  yMax: 400
};

var puck = {
  x : 400,
  y : 200,
  radius : 7
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

var score_1 = 0;
var score_2 = 0;

var userPaddle = [];

var paddleWidth = 10;
var paddleHeight = 75;

var goalPostWidth = 15;
var goalPostHeight = 200;

var fontPointSize = 30;
var editorFont = "Arial";
var canvas = document.getElementById("canvas1");
var p1Span = document.getElementById("score_1"); 
var p2Span = document.getElementById("score_2"); 

// Make a function to draw the canvas
var drawCanvas = ()=>{
  var context = canvas.getContext("2d");
  context.drawImage(base_image, 0, 0, 800, 400);

  //context.fillRect(0, 0, canvas.width, canvas.height); //Draw background

  context.font = "" + fontPointSize + "pt " + editorFont;

  // Draw paddle1
  context.fillStyle = paddle1.color;
  context.fillRect(paddle1.x, paddle1.y, paddleWidth, paddleHeight);

  // Draw paddle2
  context.fillStyle = paddle2.color;
  context.fillRect(paddle2.x, paddle2.y, paddleWidth, paddleHeight);
  
  // Draw goalPost1
  context.fillStyle = goalPost1.color;
  context.fillRect(goalPost1.x, goalPost1.y, goalPostWidth, goalPostHeight);
  
  // Draw goalPost2
  context.fillStyle = goalPost2.color;
  context.fillRect(goalPost2.x, goalPost2.y, goalPostWidth, goalPostHeight);

  context.fillStyle = "black";
  context.strokeStyle = "black";

  // Draw puck
  context.beginPath();
  context.arc(puck.x, puck.y, puck.radius, 0, 2*Math.PI);
  context.stroke();
  context.fill();

  //Update Score
  
   document.getElementById("score_1").innerHTML = score_1;
	document.getElementById("score_2").innerHTML = score_2;
  
}

var keysDown = {
  right : false,
  left : false,
  up : false,
  down : false
};

// Handle keypress
document.addEventListener("keydown", (key)=>{
  console.log(key);
  switch (key.key) {
    case "ArrowRight":
      keysDown.right = true;
      break;
    case "ArrowUp":
      keysDown.up = true;
      break;
    case "ArrowLeft":
      keysDown.left = true;
      break;
    case "ArrowDown":
      keysDown.down = true;
      break;
  }

  drawCanvas();

});

document.addEventListener("keyup", (key)=> {
  console.log(key);
  switch (key.key) {
    case "ArrowRight":
      keysDown.right = false;
      break;
    case "ArrowUp":
      keysDown.up = false;
      break;
    case "ArrowLeft":
      keysDown.left = false;
      break;
    case "ArrowDown":
      keysDown.down = false;
      break;
  }
});
/*
function scoreBoard1(){
  if((puck.x && puck.y) == (goalPost1.x && goalPost1.y)){
	  score_1++;
  }
  document.getElementById('score_1').innerHTML = score_1.toString();
}

function scoreBoard2(){
  if((puck.x && puck.y) == (goalPost2.x && goalPost2.y)){
	  score_2++;
  }
  document.getElementById('score_2').innerHTML = score_2.toString();
}
*/

function handleTimer() {

  var paddle;

  // If user has control of a paddle
  if (userPaddle == "paddle1") {
    paddle = paddle1;
  } else if (userPaddle == "paddle2") {
    paddle = paddle2;
  } else {
    return;
  }



  // Check for keys which are currently pressed, and move the paddle accordingly
  if (keysDown.right == true) {
    paddle.x += 4;
  }
  if (keysDown.left == true) {
    paddle.x -= 4;
  }
  if (keysDown.up == true) {
    paddle.y -= 4;
  }
  if (keysDown.down == true) {
    paddle.y += 4;
  }

  // Check if paddle went past x boundaries
  if (paddle.x + paddleWidth > paddle.xMax) {
    paddle.x = paddle.xMax - paddleWidth;
  } else if (paddle.x < paddle.xMin) {
    paddle.x = paddle.xMin;
  }

  //Check if paddle went past y boundaries
  if (paddle.y + paddleHeight > paddle.yMax) {
    paddle.y = paddle.yMax - paddleHeight;
  } else if (paddle.y < paddle.yMin) {
    paddle.y = paddle.yMin;
  }

  var data = {paddle: userPaddle, x: paddle.x, y: paddle.y};


  // Tell the server about the new position of the paddle
  socket.emit("positionData", JSON.stringify(data));



  drawCanvas();
}

function handleClaimLeftButton() {
  var data = "paddle1"
  // Request to get the left paddle
  socket.emit('playerRegister', JSON.stringify(data));
}

function handleClaimRightButton() {
  var data = "paddle2"
  // Request to get the left paddle
  socket.emit('playerRegister', JSON.stringify(data));
}

// On first load
document.addEventListener("DOMContentLoaded", ()=>{
  // Get the current information from the server
  socket.emit('initialSetup');

});

var socket = io('http://' + window.document.location.host);

socket.on('playerRegister', (reply)=>{
  var data = JSON.parse(reply);
  console.log(data);
  switch (data.claimStatus) {
    case "paddle1":
      paddle1.color = data.paddle.color;
      userPaddle = "paddle1";
      var rightButton = document.getElementById("playButtonRight");
      var leftButton = document.getElementById("playButtonLeft");

      // Make right button greyed out
      rightButton.style.backgroundColor = "grey";
      rightButton.onclick = ()=>{}; // Make right button do nothing


      leftButton.value = "Release"
      leftButton.onclick = ()=>{
        // Request to release paddle1
      };
      break;
    case "paddle2":
      paddle2.color = data.paddle.color;
      userPaddle = "paddle2";
      var leftButton = document.getElementById("playButtonLeft");
      var rightButton = document.getElementById("playButtonRight");

      leftButton.style.backgroundColor = "grey";
      leftButton.onclick = ()=>{}; // Make right button do nothing

      break;
  }
});

// Constant update of puck and paddles
socket.on("positionData", (respData)=>{
  var data = JSON.parse(respData);
  console.log(data);
  paddle1.x = data.paddle1.x;
  paddle1.y = data.paddle1.y;
  paddle2.x = data.paddle2.x;
  paddle2.y = data.paddle2.y;
  puck.x = data.puck.x;
  puck.y = data.puck.y;
  score_1 = data.score_1;
  score_2 = data.score_2;
  drawCanvas();
});

// For initial setup of puck and paddles
socket.on('initialSetup', (reply)=>{
  var data = JSON.parse(reply);
  console.log(data);

  // Update paddle1
  paddle1.x = data.paddle1.x;
  paddle1.y = data.paddle1.y;
  paddle1.color = data.paddle1.color;
  paddle1.taken = data.paddle1.taken;
  if (paddle1.taken == true) {
    document.getElementById("playButtonLeft").style.backgroundColor = "grey";
  }

  // Update paddle2
  paddle2.x = data.paddle2.x;
  paddle2.y = data.paddle2.y;
  paddle2.color = data.paddle2.color;
  paddle2.taken = data.paddle2.taken;
  if (paddle2.taken == true) {
    document.getElementById("playButtonLeft").style.backgroundColor = "grey";
  }

  // Update puck
  puck.x = data.puck.x;
  puck.y = data.puck.y;

  // Create interval event which draws the canvas and will handle paddle movement
  // Wait until response so it doesn't draw before it has the proper data
  timer = setInterval(handleTimer, 20);
});
