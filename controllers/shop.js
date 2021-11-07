const Product = require('../models/product');
const Order = require('../models/order');
const { Client } = require("youtubei");

const youtube = new Client();

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId)
    
  const results = await youtube.search(`${product.title} Review`, { type: 'video' });
  const videos = results;

  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    reviews: videos,
    path: '/products',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getIndex = (req, res, next) => {
  console.log(req.session.user);
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    })
    .catch(err => console.log(err));
};

exports.getFindProduct = (req, res, next) => {
  res.render('shop/findProduct', {
    path: '/find-product',
    pageTitle: 'Find Product',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.postFindProduct = (req, res, next) => {
  const category = req.body.category ? req.body.category : null;
  const skinColor = req.body.skinColor ? req.body.skinColor : null;
  const skinType = req.body.skinType ? req.body.skinType : null;
  res.redirect(`/product-list?category=${category}&skinType=${skinType}&skinColor=${skinColor}`);
};

exports.getProductList = (req, res, next) => {
  const category = req.query.category ? req.query.category : null;
  const skinColor = req.query.skinColor ? req.query.skinColor : null;
  const skinType = req.query.skinType ? req.query.skinType : null;
  console.log(category, skinColor, skinType);
  Product.find({ category: category, skinColor: skinColor, skinType: skinType })
    .then(products => {
        console.log(products);
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'Products matching your query',
          path: '/products',
          isAuthenticated: req.session.isLoggedIn,
          isAdmin: req.session.isAdmin
        });
    })
    .catch(err => console.log(err));
};