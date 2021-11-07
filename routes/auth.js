const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getUserLogin);

router.get('/signup', authController.getUserSignup);

router.post('/login', authController.postUserLogin);

router.post('/signup', authController.postUserSignup);

router.get('/admin/login', authController.getAdminLogin);

router.get('/admin/signup', authController.getAdminSignup);

router.post('/admin/login', authController.postAdminLogin);

router.post('/admin/signup', authController.postAdminSignup);

router.post('/logout', authController.postLogout);

module.exports = router;