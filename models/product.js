const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const Cart = require('./cart');

const p = path.join(rootDir, 'data', 'products.json');

// Rfactoring the model Product
const db = require("./../utils/database");

// Helper
const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        // Return a promise
        return db.execute(
            "INSERT INTO products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)", [this.title, this.imageUrl, this.price, this.description]
        );
    }

    edit() {
        return db.execute(
            "UPDATE products SET title = ?, imageUrl = ?, price = ?, description = ?  WHERE id = ?", [this.title, this.imageUrl, this.price, this.description, this.id]
        );
    }

    static fetchAll() {
        return db.execute(
            "SELECT * FROM products"
        );
    }

    static findById(id) {
        return db.execute(
            "SELECT * FROM products WHERE products.id = ?", [id]
        );
    }

    static deleteById(id) {
        return db.execute(
            "DELETE FROM products WHERE products.id = ?", [id]
        );
    }
}