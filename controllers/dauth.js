const bcrypt = require('bcryptjs');

const Doctor = require('../models/doctor');

exports.getLogin = (req, res, next) => {
  res.render('auth/dlogin', {
    path: '/doctor/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/dsignup', {
    path: '/doctor/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
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
            return req.session.save(err => {
              console.log(err);
              res.redirect('/doctor_portal');
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

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  Doctor.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/doctor/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const doctor = new Doctor({
            email: email,
            password: hashedPassword,
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
    res.redirect('/doctor/login');
  });
};
