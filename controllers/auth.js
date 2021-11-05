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
  res.render('auth/login', {
    path: '/admin/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    type: 'admin'
  });
};

exports.getDoctorLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/doctor/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    type: 'doctor'
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
  res.render('auth/signup', {
    path: '/admin/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    type: 'admin'
  });
};

exports.getDoctorSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/doctor/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    type: 'doctor'
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
        return res.redirect('/admin/login');
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
          res.redirect('/admin/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/admin/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postDoctorLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Doctor.findOne({ email: email })
    .then(doctor => {
      if (!doctor) {
        return res.redirect('/doctor/login');
      }
      bcrypt
        .compare(password, doctor.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = doctor;
            req.session.isAdmin = false;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/doctor/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/doctor/login');
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
        return res.redirect('/admin/signup');
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
          res.redirect('/admin/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDoctorSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  Doctor.findOne({ email: email })
    .then(doctorDoc => {
      if (doctorDoc) {
        return res.redirect('/doctor/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const doctor = new Doctor({
            email: email,
            password: hashedPassword,
            appointments: []
          });
          return doctor.save();
        })
        .then(result => {
          res.redirect('/doctor/login');
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