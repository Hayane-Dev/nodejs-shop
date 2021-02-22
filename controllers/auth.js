exports.getLogin = (req, res, next) => {
    console.log(req.get('Cookie'));
    const isLoggedIn = req
        .get('Cookie')
        // .split(';')[1]
        // .trim()
        .split('=')[1];
    res.render('auth/login', {
        pageTitle: 'Login Page',
        path: '/auth/login',
        isAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    // req.isLoggedIn = true;
    res.header('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
};