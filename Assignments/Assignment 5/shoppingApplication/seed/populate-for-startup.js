//NAol
var Product     = require('../models/product');
var User        = require('../models/user');
var mongoose    = require('mongoose');
var Order       = require('../models/order');
var Cart        = require('../models/cart');
mongoose.connect('mongodb://localhost/shoppingApp');


Order.remove({}, function(err){ //remove existing Order
  if(err) {
    console.log('ERROR: Remove failed')
    return
  }


})

Product.remove({}, function(err){ //remove existing Procuct documents
  if(err) {
    console.log('ERROR: Remove failed')
    return
  }
  //ALL PRODUCTS DOCUMENTS REMOVED

})

User.remove({}, function(err){ //remove existing User documents
  if(err) {
    console.log('ERROR: Remove failed')
    return
  }
  //ALL PRODUCTS DOCUMENTS REMOVED

})



var products = [
    new Product({
        imagePath   : 'https://res-2.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181669M190006_1.jpg',
        title       : 'Vetements Black Tape Lounge Pants',
        description : 'Slim-fit French terry lounge pants in black.',
        price       : 1250.99
    }),
    new Product({
        imagePath   : 'https://res-5.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181669M202023_1.jpg',
        title       : 'Vetements Black Tommy Hilfiger Edition Double Sleeve Hoodie.',
        description : 'Long sleeve French terry hoodie in black.',
        price       : 1190.99
    }),
    new Product({
        imagePath   : 'https://res-4.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181669M202013_1.jpg',
        title       : 'Vetements Tommy Hilfiger Edition Oversized Hoodie',
        description : 'Long sleeve jersey hoodie in red.',
        price       : 1630.99
    }),
    new Product({
        imagePath   : 'https://res-4.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181669M202004_1.jpg',
        title       : 'Vetements Grey Tommy Hilfiger Edition Hoodie',
        description : 'Long sleeve jersey hoodie in heather grey.',
        price       : 1630.99
    }),
    new Product({
        imagePath   : 'https://res-2.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181669M236005_1.jpg',
        title       : 'Vetements Reebox Edition Sock Pump High-Top Sneakers',
        description : 'High-top stretch-knit sock-style sneakers in black.',
        price       : 1099.99
    }),
	new Product({
        imagePath   : 'https://res-2.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/172342M236002_1.jpg',
        title       : 'Balenciaga White Speed High-Top Sneakers',
        description : 'High-Top stretch knit sneakers in white.',
        price       : 850.99
    }),
	new Product({
        imagePath   : 'https://res-4.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181342M202024_1.jpg',
        title       : 'Balenciaga Black Campaign Logo Hoodie',
        description : 'Long sleeve French terry hoodie in black.',
        price       : 1100.99
    }),
	new Product({
        imagePath   : 'https://res-3.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181342M202023_1.jpg',
        title       : 'Balenciaga Black Campaign Logo Hoodie',
        description : 'Long sleeve French terry hoodie in blue.',
        price       : 850.99
    }),
	new Product({
        imagePath   : 'https://res-2.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181607M202005_1.jpg',
        title       : 'Off-White Black Champion Edition Logo Hoodie',
        description : 'Long sleeve French terry hoodie in faded black.',
        price       : 950.99
    }),
	new Product({
        imagePath   : 'https://res-4.cloudinary.com/ssenseweb/image/upload/b_white/c_scale,h_820/f_auto,dpr_1.0/181607M202007_1.jpg',
        title       : 'Off-White Beige & Black Champion Edition Logo Hoodie',
        description : 'Long sleeve French terry hoodie in beige.',
        price       : 950.99
    })
];

for (var i = 0; i < products.length; i++){
    products[i].save(function(err, Product) {
        if (i === products.length - 1)mongoose.disconnect();
            //exit();
		})
  }
var newUser = new User({
    username    : 'admin@admin.com',
    password    : 'admin',
    fullname    : 'Cuneyt Celebican',
    admin       : true
});
User.createUser(newUser, function(err, user){
    if(err) throw err;
    console.log(user);
});

var newUser2 = new User({
    username    : 'kaleb@admin.com',
    password    : 'kaleb',
    fullname    : 'Kaleb Tesfay',
    admin       : true
});
User.createUser(newUser2, function(err, user){
    if(err) throw err;
    console.log(user);
});

var newUser3 = new User({
    username    : 'naol@admin.com',
    password    : 'naol',
    fullname    : 'Naol Gushu',
    admin       : true
});
User.createUser(newUser3, function(err, user){
    if(err) throw err;
    console.log(user);
});

function exit() {
    mongoose.disconnect();
}
