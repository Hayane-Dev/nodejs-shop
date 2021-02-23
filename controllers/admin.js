const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    // With mongoose we have to pass a javascript object
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        // userId: req.session.user
        // userId: req.user._id
        userId: req.user // suffit Mongoose extirpe l'id !!!
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
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const { title, imageUrl, price, description } = req.body;
    Product.findById(prodId)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(() => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

exports.getProducts = (req, res, next) => {
    // Mongoose function
    Product.find()
        // .populate('userId') // fetching relations data (all)
        // .select('title price -_id') // Just the title and price without the _id 
        // .populate('userId', 'name -_id') // Just the name
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                pageTitle: 'Admin Products',
                path: '/admin/products',
                prods: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('Destroyed Product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};