const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            pageTitle: 'Index',
            path: '/',
            prods: products
        });
    });
};

// For the time being, this is the same code as the above function
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            pageTitle: 'Shop',
            path: '/products',
            prods: products
        });
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        res.render('shop/product-detail', {
            pageTitle: 'Product Detail',
            path: '/products',
            product: product
        });
    });
};


exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};