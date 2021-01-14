var fs = require('fs');
 
const MongoClient = require('mongodb').MongoClient;
const DB_PATH = 'mongodb://localhost:27017/dbSongs'
 
//NOTE: path location and name of song data file
//and output data file is hard-coded but changeable
//here in one location
 
var inputFilePath = "songs/sample_songs.txt";
var outputFilePath = "songs/output.txt";
 
//parsing modes
//input mode changes when an '=' is found in data file
var MODES = {
UNKNOWN : 0,
TITLE: 1,   //parsing title of song
COMPOSER: 2, //parsing composer of song
STYLE: 3,  //parsing style of song
KEY: 4,  //parsing musical key of song
N: 5,     //place holder, no parsing
SONGDATA: 6 //parsing song chord data
};
 
fs.readFile(inputFilePath , function(err, data) {
  if(err) {
      console.log('ERROR OPENING FILE: ' + inputFilePath);
      throw err;
  }
 
  console.log('PARSING FILE: ' + inputFilePath);
 
  var fileDataString = data.toString(); //all data from file
 
  var mode = MODES.UNKNOWN;  //current parsing mode
  var parseDataString = ""; //parse data for current mode
  var currentSong = {}; //current songs being constructed
  var songsArray = []; //array of parsed songs
 
  function isEmptyObject(anObject){
     //answer whether anObject is empty
     for(var item in anObject)
        if(anObject.hasOwnProperty(item)) return false;
     return true;
  }
 
 
  function setMode(newMode){
 
 
      //now leaving mode
      if(mode === MODES.TITLE){
           currentSong.title = parseDataString;
      }
      else if(mode === MODES.COMPOSER) {
           currentSong.composer = parseDataString;
      }
      else if(mode === MODES.STYLE) {
           currentSong.style = parseDataString;
      }
      else if(mode === MODES.KEY) {
           currentSong.key = parseDataString;
      }
      else if(mode === MODES.SONGDATA) {
        //Solution for the last question;
//________________________________________________________________________________________________________-
           MongoClient.connect(DB_PATH, function(err, db){
              if(err) console.log(`FAILED TO CONNECTED TO: ${DB_PATH}`);
              else{
                 console.log(`CONNECTED TO: ${DB_PATH}`);
                 db.collection("Songs", function(err, collection){
                   currentSong.songData = parseDataString;
                   collection.insertOne({title:currentSong.title , composer: currentSong.composer, style: currentSong.style, key: currentSong.key, songData:  currentSong.songData
                 }, function(err, object){
                   var cursor = collection.find();
                   cursor.each(function(err,document){
                      console.log(document);
                      if(document == null) db.close();
                      });
                });
                 });
               } //else
           });
 
//________________________________________________________________________________________________________-
      }
 
      //now entering mode
      if(newMode === MODES.TITLE) {
            if(!isEmptyObject(currentSong))
                songsArray.push(currentSong);
            currentSong = {}; //make new empty song;
 
      }
 
      mode = newMode;
      parseDataString = "";
  }
 
  //parse the file data
  for(var i=0; i<fileDataString.length; i++){
     if(fileDataString.charAt(i) == "="){
       //change parsing mode
       if(mode === MODES.UNKNOWN) setMode(MODES.TITLE);
       else if(mode === MODES.TITLE) setMode(MODES.COMPOSER);
       else if(mode === MODES.COMPOSER) setMode(MODES.STYLE);
       else if(mode === MODES.STYLE) setMode(MODES.KEY);
       else if(mode === MODES.KEY) setMode(MODES.N);
       else if(mode === MODES.N) setMode(MODES.SONGDATA);
       else if(mode === MODES.SONGDATA) setMode(MODES.TITLE);
     }
     else{
       //add data character to content for mode
       parseDataString = parseDataString + fileDataString.charAt(i);
 
 
     }
 
  } //end parse data file
 
  //write parsed songs to console
  console.log(songsArray);
 
  //write parsed songs to output file.
  //write the array as a stringified JSON object.
  var dataAsObject = {};
  dataAsObject.songs = songsArray;
 
  fs.writeFile(outputFilePath , JSON.stringify(dataAsObject, null, 2), function(err){
    if(err) console.log(err);
    else console.log('file was saved to: ' + outputFilePath);
  });
 
 
});