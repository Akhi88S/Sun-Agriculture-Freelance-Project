var express = require("express");
var router = express.Router();
var app = express();
var nodemailer = require("nodemailer");
var ejs = require("ejs");

const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   "21979576699-gknr4jtpoh3hti14114ovhdjkfad96oi.apps.googleusercontent.com", // ClientID
//   "43k_18gXRAjJZDAj-InvUXoI", // Client Secret
//   "https://developers.google.com/oauthplayground" // Redirect URL
// );
// oauth2Client.setCredentials({
//   refresh_token:
//     "1//04HEpRVsZfmS3CgYIARAAGAQSNwF-L9IrsADrW9tSP2fpeu80RZPnp-plGVit5NseVnGOmv_MnTFnZkTosJUw1rSnUvZfq-7wwv8",
// });
// const accessToken = oauth2Client.getAccessToken();

// get Product model
var Product = require("../models/product");
var Category = require("../models/category");

/*
 * GET add product to cart
 */

router.get("/add/:product", function (req, res, next) {
  var slug = req.params.product;

  Product.findOne({ slug: slug }, function (err, p) {
    if (err) console.log(err);

    if (typeof req.session.cart == "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        title: slug,
        qty: 1,
        price: parseFloat(p.price).toFixed(2),
        image: p.image,
      });
    } else {
      var cart = req.session.cart;
      var newItem = true;

      for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
          cart[i].qty++;
          newItem = false;
          break;
        }
      }

      if (newItem) {
        cart.push({
          title: slug,
          qty: 1,
          price: parseFloat(p.price).toFixed(2),
          image: p.image,
        });
      }
    }
    // console.log(req.session.cart);
    req.flash("success", "Product added to cart!");
    res.redirect("/products");
  });
});

/*
 * GET checkout page
 */
router.get("/checkout", function (req, res, next) {
  if (req.session.cart && req.session.cart.length == 0) {
    delete req.session.cart;
    res.redirect("/cart/checkout");
  } else {
    res.render("checkout", {
      title: "Checkout",
      cart: req.session.cart,
    });
  }
});

/*
 * GET update checkout page
 */
router.get("/update/:product", function (req, res, next) {
  var slug = req.params.product;
  var cart = req.session.cart;
  var action = req.query.action;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].title == slug) {
      switch (action) {
        case "add":
          cart[i].qty++;
          break;
        case "remove":
          cart[i].qty--;
          if (cart[i].qty < 1) cart.splice(i, 1);
          break;
        case "clear":
          cart.splice(i, 1);
          if (cart.length == 0) delete req.session.cart;
          break;
        case "default":
          console.log("Update problem!");
          break;
      }
      break;
    }
  }

  // req.flash('success', 'Cart updated!');
  res.redirect("/cart/checkout");
});

/*
 * GET clear cart
 */
router.get("/clear", function (req, res, next) {
  delete req.session.cart;

  req.flash("success", "Cart cleared!");
  res.redirect("/cart/checkout");
});

/*
 * GET buy now
 */
router.get("/buynow", function (req, res, next) {
  delete req.session.cart;

  res.sendStatus(200);
});
router.post("/search", function (req, res, next) {
  val = req.body.search;
  console.log(val);
  Category.find({}, function (err, categories) {
    Product.find({}, function (err, products) {
      res.render("all-products2", {
        title: "Search",
        val: val,
        products: products,
        categories: categories,
      });
    });
  });
});

/* Product.findOne({ title: val }, function (err, product) {
    if (err) console.log(err);
    if (product==0) {
      Category.find({}, function (err, categories) {

      Product.find({}, function (err, products) {
var res;
      var x= req.flash('danger', 'Oops no such product, Check outsmilar products below');
      res.render('all-products2', {
        title: "Search",
        x:x,
      products: products,
        categories: categories

      });
      });
});
    }

  else {
    Category.find({}, function (err, categories) {

    Product.find({}, function (err, products) {
      res.render('all-products3', {
        title: "Search",
        products: products,
        categories: categories

      });
    });
    });
}

}); */

router.get("/buy", function (req, res, next) {
  if (req.session.cart && req.session.cart.length == 0) {
    delete req.session.cart;
    res.redirect("cart/checkout");
  } else {
    res.render("buyform", {
      title: "Place Order",
      cart: req.session.cart,
    });
  }
});

router.post("/sendemail", function (req, res, next) {
  cart = req.session.cart;
  user = req.user;
  console.log(user.email);
  console.log(user.phno);
  var addr = req.body.addr;
  res.sendFile("yay.html", { root: __dirname });
  // var transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: "weirdzombies",
  //     clientId:
  //       "21979576699-gknr4jtpoh3hti14114ovhdjkfad96oi.apps.googleusercontent.com",
  //     clientSecret: "43k_18gXRAjJZDAj-InvUXoI",
  //     refreshToken:
  //       "1//04HEpRVsZfmS3CgYIARAAGAQSNwF-L9IrsADrW9tSP2fpeu80RZPnp-plGVit5NseVnGOmv_MnTFnZkTosJUw1rSnUvZfq-7wwv8",
  //     accessToken: accessToken,
  //     //pass: 'Weirdzombiegmail33$'
  //   },
  //   tls: {
  //     rejectUnauthorized: false,
  //   },
  // });

  ejs.renderFile(
    __dirname + "/Email.ejs",
    {
      cart: req.session.cart,
      user: req.user,
      addr: addr,
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        //   var toemail=['weirdzombies@gmail.com','akhilkanapala@gmail.com']
        // var mailOptions = {
        //   from: 'weirdzombies@gmail.com',
        //   to: toemail,
        //   subject: 'New Order',
        //   headers: {
        //     'priority': 'high',
        //  },
        //   html: data
        //   };
        //   var mailOptions1 = {
        //     from: ['weirdzombies@gmail.com'],
        //     to:user.email,
        //     subject: 'Your Order',
        //     html: data,
        //     headers: {
        //       'priority': 'high',
        //    },
        //     };
        // transporter.sendMail(mailOptions, function(error, info){
        //   if (error) {
        //     console.log("This is an error "+error);
        //   } else {
        //     console.log('Email sent: ' + info.response);
        //   }
        // });
        // transporter.sendMail(mailOptions1, function(error, info){
        //   if (error) {
        //     console.log("This is an error "+error);
        //   } else {
        //     console.log('Email sent: ' + info.response);
        //   }
        // });
      }
    }
  );
  delete req.session.cart;
});

router.get("/running", function (req, res) {
  res.send("Running");
});

module.exports = router;
