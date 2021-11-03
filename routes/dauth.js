const express = require('express');

const authController = require('../controllers/dauth');

const router = express.Router();

router.get('/doctor/login', authController.getLogin);

router.get('/doctor/signup', authController.getSignup);

router.post('/doctor/login', authController.postLogin);

router.post('/doctor/signup', authController.postSignup);

router.post('/doctor/logout', authController.postLogout);

module.exports = router;