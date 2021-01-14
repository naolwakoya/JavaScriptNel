/*
Prerequisites:

1)You must have mongodb server running on its default port 27017.

2)You must have installed the npm module: mongoose
by executing the command:

npm install mongoose
*/


const mongoose = require('mongoose')
//Create a schema that describes what properities cats have
var catSchema = mongoose.Schema({
    name: String,
    favouriteToy: String

  //mongoose.disconnect()
})



//Create a model based on cat Schema
//A model is a class with which documents are created.
//A model wraps the schema in useful methods like .save(), .find()
var Cat = mongoose.model('Cat', catSchema)

Cat.remove({}, function(err){ //remove existing cat documents
  if(err) {
    console.log('ERROR: Remove failed')
    return
  }
  //ALL CAT DOCUMENTS REMOVED
})


//connect to database and add documents
mongoose.connect('mongodb://localhost/cats', function(err){
  if (err) throw err;
  console.log('Successfully connected to mongodb');

  let catsToAdd = []
  catsToAdd.push(new Cat({name: "Bowie", favouriteToy: "BusyBee"}))
  catsToAdd.push(new Cat({name: "O'Grady", favouriteToy: "Yarn"}))
  catsToAdd.push(new Cat({name: "Zoom", favouriteToy: "Toes"}))
  catsToAdd.push(new Cat({name: "Chatner", favouriteToy: "Mr. Spock"}))

  for(let i=0; i<catsToAdd.length; i++){
    catsToAdd[i].save(function(err, cat){
      console.log(`saving: ${catsToAdd[i].name}`)
      if(i==catsToAdd.length-1)mongoose.disconnect();
    })
  }
})
