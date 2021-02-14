const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    // Error : Cannot read property 'length' of undefined
    // FetchAll asynchrone function !!! But it returns nothing...
    const products = Product.fetchAll();
    // This part of code is executed with waiting for the traitement of fetchAll so products in not defined yet
    res.render('shop', {
        pageTitle: 'Shop',
        path: '/',
        prods: products
    });
};