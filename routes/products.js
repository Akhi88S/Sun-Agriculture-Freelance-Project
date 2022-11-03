var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
// var auth = require('../config/auth'); -- for access control --
// var isUser = auth.isUser;

// get Product model
var Product = require('../models/product');

// get Category model
var Category = require('../models/category');

/*
 * GET all products
*/
router.get('/', function (req, res, next) {
  // router.get('/', isUser, function (req, res, next) {  -- for access control --

  Category.find({}, function (err, categories) {
    Product.find({}, function (err, products) {
      if (err)
        console.log(err);

      res.render('all-products', {
        title: 'All products',
        products: products,
        categories: categories
      });
    });
  })

});


/*
* GET products by category
*/
router.get('/:category', function (req, res, next) {

  var categorySlug = req.params.category;

  Category.findOne({ slug: categorySlug }, function (err, c) {
    Product.find({ category: categorySlug }, function (err, products) {
      if (err)
        console.log(err);

      res.render('category-products', {
        title: "products",
        products: products,
      });
    });
  });

});


/*
* GET products details
*/
router.get('/:category/:product', function (req, res, next) {

  var loggedIn = (req.isAuthenticated()) ? true : false;

  Product.findOne({ slug: req.params.product }, function (err, product) {
    if (err) {
      console.log(err);
    } else {

          res.render('product-details', {
            title: product.title,
            p: product,
            loggedIn: loggedIn
          });


    }
  });

});


module.exports = router;
