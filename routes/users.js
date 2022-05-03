const express = require('express');
const passport = require('passport')
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/users')

router.route('/register')
            .get(user.rendeRegister)
            .post(catchAsync(user.register));

router.route('/login') 
            .get(user.renderLogin)
            .post(passport.authenticate('local', {failureflash: true, failureRedirect:'/login'}), user.login);

router.get('/logout', user.logout);

module.exports = router;