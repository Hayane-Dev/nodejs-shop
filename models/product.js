const { getProducts } = require("../controllers/products");

const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            console.log(err);
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    }
}