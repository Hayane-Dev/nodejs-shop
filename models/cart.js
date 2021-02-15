// Cart Model
const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'cart.json');

// Helper
const fetchPreviousCart = (cb) => {
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
        fetchPreviousCart((cart) => {
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
}