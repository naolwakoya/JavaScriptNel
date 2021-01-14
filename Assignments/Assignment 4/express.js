/*
Interacting with external services

Simple example of node.js app serving contents based 
on an available internet service. 
In this case api.food2fork.org

***IMPORTANT NOTE***
free account at: http://food2fork.org/appid

To Test: Use browser to view... 
	http://localhost:3000
	http://localhost:3000/
	http://localhost:3000/recipes
	http://localhost:3000/recipes.html
	http://localhost:3000/index.html
	http://localhost:3000/recipes?ingredient=Basil,Cumin
*/

const express = require('express'); 
const server = express();
let http = require('http');
const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public'; 
const API_KEY = 'b40994c8185c98926ec6364fb87d1216';

function sendRespnse(recipesData, res){
  let data = JSON.parse(recipesData);
  //html stuff
  let style = '<style type="text/css">' +
	'a {float: left; padding: 30px}' +
	'form {padding: 30px; font-family: Calibri; font-size: 17px}' +
	'body {background: #ffffff}' + 
	'input.in1 {background: #87cefa}' +
	'p {font-size: 20px}'
  + '</style>';
  
  var page = '<!DOCTYPE html>' +
	'<html><head><title>COMP 2406 Assignment 4</title></head>' +
    '<body>' +
	style +
    '<form action="http://localhost:3000/recipes" method="get" align="center">' +
    'Enter an Ingredient  <input name="ingredient">' +
    '<input id="in1" type="submit" value="Submit">' +
    '</form>'
  if(recipesData){
	  
	for(var i = 0; i < data.count; i++){
		page += '<a href="' + data.recipes[i].source_url + '" target="view_window" height=400 width=400>';
		page += '<img src= "' + data.recipes[i].image_url + '" alt = "food2fork" height=400 width=500 />';
		page += '<p>' + data.recipes[i].title +'</p>';
		page += '</a>';
		
	}
  }
  page += '</body></html>'
  res.send(page);
}
// Parsing the data
function parseData(recipesRespones, res){
  let recipesData = ''
  recipesRespones.on('data', function (chunk) {
    recipesData += chunk
  })
  recipesRespones.on('end', function () {
    sendRespnse(recipesData, res)
  })
}

function getRecipes(ingredient, res){

// getting the recipes from the cite
  const options = {
     host: 'www.food2fork.com',
     path: `/api/search?q=${ingredient}&key=${API_KEY}`
  }
  http.request(options, function(apiResponse){
    parseData(apiResponse, res);
  }).end()
}

//Middleware
server.all('*', function(req, res, next){
  console.log('-------------------------------');
  console.log('req.path: ', req.path);
  console.log('serving:' + __dirname + ROOT_DIR + req.path);
  next(); //allow next route or middleware to run
});

server.get('/', function (req, res) {
  getRecipes('Basil', res);
})

//default keyword is 'Basil'
server.get('/recipes', function (req, res) {
	
	var name = req.query.ingredient || 'Basil';
	console.log('Keyword:  ', name);
	
	getRecipes(name, res);
})
// if recipes.html this outputs Cake as default
server.get('/recipes.html', function (req, res) {
	
	var name = req.query.ingredient || 'Cake';
	console.log('Keyword:  ', name);
	
	getRecipes(name, res);
})
// if index.html this Outputs Cake as default
server.get('/index.html', function (req, res) {
	
	var name = req.query.ingredient || 'Cake';
	console.log('Keyword:  ', name);
	
	getRecipes(name, res);
})
// if recipes?ingredients=Basil,Cumin this outputs Basil and Cumin together
server.get('/recipes?ingredient=Basil,Cumin', function (req, res){
	var name = req.query.ingredient || 'Basil,Cumin';
	//var name2 = req.query.ingredients || 'Cumin';
	console.log('Keyword(s): ', name);
	//console.log('keyword: ', name2);
	
	getRecipes(name, res);
	//getRecipes(name2, res);
})

//start server
server.listen(PORT, err => {
  if(err) console.log(err)
  else {console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)}
})