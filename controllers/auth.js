const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const User = require('../models/user');
const { log } = require('console');
const user = require('../models/user');

const { validationResult } = require('express-validator');

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()
        });
    }
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

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'melkorchi80@gmail.com',
                    // from: 'shopMongoDB@gmail.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>
                    `
                });
            })
            .catch(err => {
                console.log(err);
            })
    });
};

exports.getNewPassword = (req, res, next) => {
    // Check the token
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid token.');
                return res.redirect('/login');
            }
            console.log('user', user);
            let msg = req.flash('error');
            if (msg.length > 0) {
                msg = msg[0];
            } else {
                msg = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: msg,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const token = req.body.passwordToken;
    let resetUser;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcryptjs.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(() => {
            res.redirect('/login');
            transporter.sendMail({
                to: req.body.email,
                from: 'melkorchi80@gmail.com',
                subject: 'Password reseted',
                html: `
                        <p>Your password has been reseted !</p>
                    `
            });
        })
        .catch(err => {
            console.log(err);
        })
};