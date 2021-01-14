/* Example of javascript functions

Example adapted from:
 "Elequent Javascript" 2nd ed. by Marijn Haverbeke
http://eloquentjavascript.net/03_functions.html


Exercise 1: 

Modify the code given below so that the hill function makes use of the 
underscore character, just like the flat function does, 
expect the mountain tops will have to be drawn on the previous line of the output.

Also modify the code so that the following script portion will 
result in the terrain shown.

  //BUILD SCRIPT
  flat(3)
  hill(5);
  flat(2);
  hill(3);
  flat(4);
  hill(1);
  flat(2);
  //END SCRIPT


function and the program produces the following terrain.

    _____    ___
___/     \__/   \____/\__


Exercise 2: 

Modify the code from exercise 1 so you can have both hills and mountains. 
Mountains are require two output lines. 

After completing exercise 2 the following BUILD SCRIPT portion should produce the output shown. 

  //BUILD SCRIPT
  flat(3)
  mountain(3);
  flat(2);
  mountain(0);
  flat(4);
  hill(1);
  flat(1);
  //END SCRIPT


function and the program produces the following terrain.

     ___  
    /   \    /\      _
___/     \__/  \____/ \_


*/

//Exercise 1 Hard Code Verison
/*
let landscape = function() {
  let result = "";
  let flat = function(size) {
    for (let count = 0; count < size; count++)
      result += "_";
  };
	console.log("    _____    ___      _");
  let hill = function(size) {
	result += "/";
    for (let count = 0; count < size; count++)
      result += " ";
    result += "\\";
  };


  //BUILD SCRIPT
  flat(3);
  hill(5);
  flat(2);
  hill(3);
  flat(4);
  hill(1);
  flat(2);
  //END SCRIPT
  return result;
  
};

*/
//Excerise 2 Hard Code version
/*
let landscape = function() {
  let result = "";
  let flat = function(size) {
    for (let count = 0; count < size; count++)
      result += "_";
  };
  let hill = function(size) {
	result += "/";
    for (let count = 0; count < size; count++)
      result += " ";
    result += "\\";
  };

  //BUILD SCRIPT
  flat(3);
  hill(3);
  flat(2);
  hill(2);
  flat(4);
  hill(1);
  console.log("     _");
  console.log("    / \\    /\\      _");
  flat(1);
  return result;
  //END SCRIPT
};
*/
let landscape = function() {

  let result = "";
  let flat = function(size) {
    for (let count = 0; count < size; count++)
      result += "_";
    return result;
  };
  let hill = function(size) {
    result += "/";
    for (let count = 0; count < size; count++)
      result += "'";
    result += "\\";
    return result;
  };
  let mountain = function(size){
    result += "st";
    for (let count = 0; count < size; count++){
      result += "m";
    }
    result += "en";
    return result;
  }


  // //BUILD SCRIPT
  flat(3)
  hill(4);
  flat(6);
  hill(1);
  flat(1);
  //BUILD SCRIPT
 flat(3)
 mountain(3);
 flat(2);
 mountain(0);
 flat(4);
 hill(1);
 flat(1);
//END SCRIPT

  var newResult = "";
  
  for (var i =0; i < result.length; i++){
    if (result[i] == "m"){
      newResult += ("_");
    } else {
      newResult += " ";
    }
  }

  console.log(newResult);
  newResult = "";
  for (var i = 0; i<result.length; i++){
      if (result.charAt(i) == "t"){
        newResult += "/";
      } else if (result.charAt(i)=="e"){
        newResult += "\\";
      }else if (result.charAt(i)=="'"){
        newResult += "_";
      }
      else{ 
        newResult += " ";
      } 
  }

  console.log(newResult);
  newResult = "";
  for (var i = 0; i < result.length; i++){
    if (result.charAt(i)== "_"){
      newResult += result.charAt(i);
    }else if (result.charAt(i) == "s"){
      newResult += "/";
    }else if (result[i] == "n"){
      newResult += "\\";
    } else if (result[i] == "/") {newResult += "/";}
    else if (result[i] == "\\"){ newResult += "\\";}
    else{
      newResult += " ";
    }
  }

  console.log(newResult);
  //END SCRIPT

  return " ";

  
};

console.log("");
console.log(landscape());
//  ___/''''\______/'\_
