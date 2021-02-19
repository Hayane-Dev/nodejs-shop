const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    Product.create({
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
};

// http://localhost:3000/admin/edit-product/1234?edit=true (manually to test !!!)
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([rows, fieldData]) => {
            // console.log(rows);
            if (!rows) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: rows[0]
            });
        })
        .catch(err => console.log(error))
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const { title, imageUrl, price, description } = req.body;
    const updatedProduct = new Product(prodId, title, imageUrl, price, description);
    // updatedProduct.save();
    updatedProduct.edit();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    // console.log('prodId: ', prodId);
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};