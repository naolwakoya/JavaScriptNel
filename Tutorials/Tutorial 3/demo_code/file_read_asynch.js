
/*
Example of ASYNCHRONOUS file read.
Function readFile does not block (wait) for the file to be read.

Instead its argument function(err,data) will be called once the file has been read.
function(err,data) is the "call back" function that will be called when readFile's task is done.

Notice "DONE" gets written to the console before the file contents. Make
sure you understand why that is.
*/


const fs = require('fs');
const colour = require('colour')  //npm install colour
fs.readFile('songs/sister_golden_hair.txt', function(err, data) {
	
  var upperString = "";
  var lowerString = "";
  if(err) throw err;
  let array = data.toString().split("\n");

  for (var i= 0; i < array.length;i++){
  	upperString = "";
  	lowerString = "";
  	var temp = array[i].toString().split(" ");
  	for (var j = 0; j<temp.length;j++){
  		if (temp[j].charAt(0) == "["){
  			upperString += temp[j];
  		} else {
  			upperString += (" ".repeat(temp[j].length));
  		}
  	}
  	console.log(upperString.green);
  	for (var k = 0; k < temp.length; k++){
  		if (temp[k].charAt(0)!= "["){
  			lowerString += " " + temp[k] + " ";
  		} else {
  			lowerString += "".repeat(temp[k].length);
  		}
  	}
  	console.log(lowerString.yellow);
  }
 
  

});
console.log("DONE");
