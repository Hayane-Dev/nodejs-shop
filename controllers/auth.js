const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let msg = req.flash('error');
    if (msg.length > 0) {
        msg = msg[0];
    } else {
        msg = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        // isAuthenticated: false,
        // csrfToken: req.csrfToken()
        errorMessage: msg
    });
};

exports.getSignup = (req, res, next) => {
    let msg = req.flash('error');
    if (msg.length > 0) {
        msg = msg[0];
    } else {
        msg = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        // isAuthenticated: false
        errorMessage: msg
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcryptjs
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    // Check if the email already exists
    User.findOne({ email: email })
        .then(user_doc => {
            if (user_doc) {
                req.flash('error', 'Email exists aleady, please pick another one.');
                return res.redirect('/signup');
            }

            return bcryptjs.hash(password, 12)
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
                    // Sending an email to confirm the signup
                    return transporter.sendMail({
                        to: email,
                        from: 'melkorchi80@gmail.com',
                        subject: 'Inscription',
                        html: '<h1>Votre inscription s\'est déroulée avec succès !</h1>'
                    });
                })
                .catch(err => {
                    console.log(err);
                });
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

exports.getReset = (req, res, next) => {
    let msg = req.flash('error');
    if (msg.length > 0) {
        msg = msg[0];
    } else {
        msg = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: msg
    });
};