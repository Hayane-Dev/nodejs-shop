const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        pageTitle: 'Login Page',
        path: '/auth/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('60336646a9ffba4714a59d83')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // res.redirect('/');
            // With this code we are not sure that the session is setted before the redirection so...
            // Adding this function to be sure ...
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            })

        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};