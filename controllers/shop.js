const Product = require('../models/product');
const Order = require('../models/order');
const user = require('../models/user');

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
    Product.findById(prodId)
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
    req.user
        .populate('cart.items.productId')
        .execPopulate() //return a promise to avoid error: req.user.populate(...).then is not a function
        .then(user => {
            console.log(user.cart.items);
            const products = user.cart.items;
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
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
    Product.findById(prodId)
        .then(product => {
            return req.user.deleteCartItem(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            // console.log(user.cart.items);
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    // product: i.productId // PB: give only the id of the product !!! Even if it is supposed to return all the object !!!
                    product: {...i.productId._doc } // Trick to get all the object
                };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user // req.user._id
                },
                products: products
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrderOld = (req, res, next) => {
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