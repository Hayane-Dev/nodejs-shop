// Cart Model
const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'cart.json');

// const Product = require('./product');

// Helper
const fetchCart = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 };
        if (!err) {
            cart = JSON.parse(fileContent);
        }
        cb(cart);
    });
};

module.exports = class Cart {

    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fetchCart((cart) => {
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Add new product or increase quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct };
                updatedProduct.qty += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += +productPrice;
            // Save the cart
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        })

    }

    static deleteProduct(id, productPrice) {
        fetchCart((cart) => {
            const updatedCart = {...cart };
            const productInCart = updatedCart.products.find(i => i.id === id);
            if (!productInCart) {
                return 'The product is not in the cart';
            }
            const amount = productInCart.qty * productPrice;
            updatedCart.totalPrice = updatedCart.totalPrice - amount;
            updatedCart.products = updatedCart.products.filter(i => i.id !== id);
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            })
        });
    }
}