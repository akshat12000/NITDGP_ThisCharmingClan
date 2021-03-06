const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');

exports.getUserLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    type: 'user'
  });
};

exports.getAdminLogin = (req, res, next) => {
  res.render('auth/alogin', {
    path: '/admin/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    type: 'admin'
  });
};


exports.getUserSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    type: 'user'
  });
};

exports.getAdminSignup = (req, res, next) => {
  res.render('auth/asignup', {
    path: '/admin/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    type: 'admin'
  });
};


exports.postUserLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.isAdmin = false;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postAdminLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Admin.findOne({ email: email })
    .then(admin => {
      if (!admin) {
        return res.redirect('/admin/alogin');
      }
      bcrypt
        .compare(password, admin.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = admin;
            req.session.isAdmin = true;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/admin/alogin');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/admin/alogin');
        });
    })
    .catch(err => console.log(err));
};


exports.postUserSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postAdminSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  Admin.findOne({ email: email })
    .then(adminDoc => {
      if (adminDoc) {
        return res.redirect('/admin/asignup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const admin = new Admin({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return admin.save();
        })
        .then(result => {
          res.redirect('/admin/alogin');
        });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};