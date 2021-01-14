var timer;
var express                 = require('express');
var router                  = express.Router();
var Cart                    = require('../models/cart');
var Order                   = require('../models/order');
var paypal = require('paypal-rest-sdk');

 //Paypal configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ATi9bVuDq-vGytR_NNITWPQ0LKIhEtPBW47SfIKlEhRrsV_rzYqWs0NNTqDmtW3hibkOQRfsjxX6TDlF',
  'client_secret': 'EPJBWV8Ha3hmj9CEtbWcSCuS8iPU-LvFs9yqiDEhHqTIpsCzXPMQ8Q6P5VIiFPO6zy7lP-SXYvxgFdbX'
});


// GET checkout page
router.get('/', ensureAuthenticated, function(req, res, next){
    console.log(`ROUTE: GET CHECKOUT PAGE`)
    var cart = new Cart(req.session.cart)
    var totalPrice = cart.totalPrice
    res.render('checkout', {title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, bodyClass: 'registration', containerWrapper: 'container', userFirstName: req.user.fullname});
})

// POST checkout-process
router.post('/checkout-process', function(req, res){
   console.log(`ROUTE: POST CHECKOUT-PROGRESS`)
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice;
    var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/checkout/checkout-success",
        "cancel_url": "http://localhost:3000/checkout/checkout-cancel",
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": totalPrice,
                "currency": "CAD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "CAD",
            "total": totalPrice
        },
        "description": "This is the payment description."
    }]
};





paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0; i < payment.links.length; i++){
          if (payment.links[i].rel === 'approval_url' ){
            timer = payment.create_time
            res.redirect(payment.links[i].href);
          }
        }
    }
});

  });





// GET checkout-success
router.get('/checkout-success', ensureAuthenticated, function(req, res){
  var newOrder = new Order({
    orderID        :req.query.paymentId,
    username       :req.user.username,
    address        : '1 Marie-Victorin undefined Toronto Ontario CA M5A 1E1',
    orderDate      : timer,
    shipping       :  true
  });
  newOrder.save();

    console.log(`ROUTE: GET CHECKOUT-SUCCESS`)
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice;
    res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
    req.session.cart = ('/cart/update', (req, res) =>{
      let qtys = req.body["qty[]"];
      if(Security.isValidNonce(req.body.nonce, req)) {
        Cart.updateCart(qtys);
        Cart.saveCart(req);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
    });
});

//clearing shopping bag




// PAYMENT CANCEL
router.get('/checkout-cancel', ensureAuthenticated, function(req, res){
    console.log(`ROUTE: GET CHECKOUT-CANCEL`)
    res.render('checkoutCancel', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname});
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        console.log(`ERROR: USER IS NOT AUTHENTICATED`)
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;
