const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    // Mongoose method
    Product.find()
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
    Product.find()
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
            // console.log('cart:', cart);
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
    let newQuantity = 1;
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

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;

            }
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { // Magic method
                through: { quantity: newQuantity } // Setting additional fields 
            });
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
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then((products) => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        // orderItem is the same which is passed in the order-item model...lowercase
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .then(() => {
            // Resetting the cart (magic method)
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    // Magic method sequelize
    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};