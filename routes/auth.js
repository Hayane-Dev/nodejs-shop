const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('./../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login', [
        check('email')
        .isEmail()
        .withMessage('Invalid Email !')
        .custom((value, { req }) => {
            return true;
        }),
        body('password', 'Invalid password !')
        .isLength({ min: 5 })
        .isAlphanumeric()
        // .withMessage('Invalid password !')
        .custom((value, { req }) => {
            return true;
        })
    ], authController.postLogin);

router.post(
    '/signup', [
        check('email')
        .isEmail()
        .withMessage('Invalid Email !')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email address is forbidden !');
            // }
            // return true;
            // Moving the code from auth controller to here (validation!!!)
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email exists aleady, please pick another one.');
                }
            });
        }),
        body('password', 'Please enter a password with only numbers and text at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric(),
        body('confirmPassword')
        .custom((value, { req }) => {
            if (req.body.password !== value) {
                throw new Error('Passwords have to match.');
            }
            return true;
        })
    ], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;