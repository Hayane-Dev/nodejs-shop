const { getProducts } = require("../controllers/admin");

const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'products.json');

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
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err) console.log(err);
            });

        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}