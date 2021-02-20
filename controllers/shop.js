const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    // Sequelize method findAll
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Index',
                path: '/',
                prods: products
            });
        })
        .catch(err => console.log(err));
};

// For the time being, this is the same code as the above function
exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'Products',
                path: '/products',
                prods: products
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: product.title,
                path: '/products',
                product: product
            });
        })
        .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
    // Using magic methods
    req.user
        .getCart()
        .then(cart => {
            console.log('cart:', cart);
            return cart
                .getProducts() // Magic method
                .then(products => {
                    res.render('shop/cart', {
                        pageTitle: 'Cart',
                        path: '/cart',
                        products: products
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart; // Pb of scope !!!
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } }); // Magic method
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                // Later
            }
            return Product
                .findByPk(prodId)
                .then(product => {
                    return fetchedCart.addProduct(product, { // Magic method
                        through: { quantity: newQuantity } // Setting additional fields 
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
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