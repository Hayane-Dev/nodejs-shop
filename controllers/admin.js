const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.render('admin/add-product', {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, next) => {
    // const product = new Product(req.body.title);
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(title, imageUrl, price, description)
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    // res.render('admin/add-product', {
    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
            prods: products
        });
    });
};