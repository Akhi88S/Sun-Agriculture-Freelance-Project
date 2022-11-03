var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

// get Product model
var Product = require('../models/product');

// get Category model
var Category = require('../models/category');

/*
* GET products index
*/
router.get('/', isAdmin, function (req, res, next) {
  var count;

  Product.count(function (err, c) {
    count = c;
  });
  Product.find({}, function (err, products) {
    res.render('admin/products', {
      products: products,
      count: count
    });
  });

});

/*
* GET add product
*/
router.get('/add-product', isAdmin, function (req, res, next) {

  var title = "";
  var desc = "";
  var price = "";
  var image=""

  Category.find({}, function (err, categories) {
    res.render('admin/add-product', {
      title: title,
      desc: desc,
      price: price,
      categories: categories,
      image:image
    });
  });

});

/*
* POST add product
*/
router.post('/add-product', function (req, res, next) {


  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Descrtiption must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;
  var image = req.body.image;

  var errors = req.validationErrors();

  if (errors) {
    Category.find(function (err, categories) {
      res.render('admin/add-product', {
        errors: errors,
        title: title,
        desc: desc,
        price: price,
        categories: categories,
        image:image
      });
    });
  } else {
    Product.findOne({ slug: slug }, function (err, product) {
      if (product) {
        req.flash('danger', 'Product title exists, choose another');
        res.render('admin/add-product', {
          title: title,
          desc: desc,
          price: price,
        category: category,
          image:image,
        });
      } else {
        var price2 = parseFloat(price).toFixed(2);
        var product = new Product({
          title: title,
          slug: slug,
          desc: desc,
          price: price2,
          category: category,
          image: image
        });

        product.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash('success', 'Product added');
          res.redirect('/admin/products');
        });
      }
    });
  }

});

/*
* GET edit product
*/
router.get('/edit-product/:id', isAdmin, function (req, res, next) {

  var errors;

  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Category.find(function (err, categories) {

    Product.findById(req.params.id, function (err, product) {
      if (err) {
        console.log(err);
        res.redirect('/admin/products');
      } else {
        res.render('admin/edit-product', {
              errors: errors,
              title: product.title,
              desc: product.desc,
              price: parseFloat(product.price).toFixed(2),
              categories: categories,
              category: product.category.replace(/\s+/g, '-').toLowerCase(),
              image: product.image,
              id: product._id
            });
    }
    });

  });

});

/*
* POST edit product
*/
router.post('/edit-product/:id', function (req, res, next) {


  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Descrtiption must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;
  var image = req.body.image;
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect('/admin/products/edit-product/' + id);
  } else {
    Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, prod) {
      if (err)
        console.log(err);
      if (prod) {
        req.flash('danger', 'Product title already exists, please choose another');
        res.redirect('/admin/products/edit-product/' + id);
      } else {
        Product.findById(id, function (err, prod) {
          if (err)
            console.log(err);

          prod.title = title;
          prod.slug = slug;
          prod.desc = desc;
          prod.price = parseFloat(price).toFixed(2);
          prod.category = category;
          prod.image = image;


          prod.save(function (err) {
            if (err)
              console.log(err);

            req.flash('success', 'Product edited!');
            res.redirect('/admin/products');
          });

        });
      }

    });
  }
});

/*
/* POST product gallery page
*/
/*
/* GET delete image
*/


/*
/* GET delete product
*/
router.get('/delete-product/:id', isAdmin, function (req, res, next) {
var id = req.params.id;
  Product.findByIdAndRemove(id, function (err) {
    if(err){
              console.log(err);
}else{
      req.flash('success', 'Product deleted!');
      res.redirect('/admin/products');

  }

      });
});


// exports
module.exports = router;
