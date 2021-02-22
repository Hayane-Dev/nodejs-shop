exports.getLogin = (req, res, next) => {
    // console.log(req.get('Cookie'));
    // const isLoggedIn = req
    //     .get('Cookie')
    //     // .split(';')[1]
    //     // .trim()
    //     .split('=')[1] == 'true';
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        pageTitle: 'Login Page',
        path: '/auth/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // Generate a cookie: connect.sid
    req.session.isLoggedIn = true;
    res.redirect('/');
};