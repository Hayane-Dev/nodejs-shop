const User = require('../models/user');
const bcryptjs = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('603594b23ee38d2de824fb22')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    // Check if the email already exists
    User.findOne({ email: email })
        .then(user_doc => {
            if (user_doc) {
                return res.redirect('/signup');
            }

            return bcryptjs.hash(password, 12);
        })
        .then((hashedPassword) => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save()
        })
        .then(() => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};