const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    // const product = new Product(title, imageUrl, price, description, null, req.user._id);
    // With mongoose we have to pass a javascript object
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        // userId: req.user._id
        // Mongoose knows that it just have to store e reference of the user
        userId: req.user
    });
    // The method save continue to work but now it's a mongoose method (provided by mongoose)
    product.save()
        .then(() => {
            console.log("Product Created");
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // Product.findByPk(prodId)
    req.user
        .getProducts({ where: { id: prodId } }) // Magic method
        // .then(product => {
        .then(products => {
            // Don't forget getProducts return an array !!!
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: product
            });
        })
        .catch(err => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const { title, imageUrl, price, description } = req.body;
    Product.findByPk(prodId)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(result => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(error));

};

exports.getProducts = (req, res, next) => {
    // Product.findAll()
    req.user
        .getProducts()
        .then(products => {
            res.render('admin/products', {
                pageTitle: 'Admin Products',
                path: '/admin/products',
                prods: products
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            console.log('Destroyed Product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};