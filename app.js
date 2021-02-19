const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

// In order to build associations
const User = require("./models/user");
const Product = require("./models/product");

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
// folder public -> css (make accessible)
app.use(express.static(path.join(__dirname, 'public')));

// Filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// If no request is intercepted
app.use(errorController.get404);

// Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// Call Sequelize ... Creating tables if needed...there is a check...
sequelize
    .sync({ force: true }) // Force la destruction des tables et la recréation de celles-ci avec les modifs relatives aux associations
    .then(() => {
        app.listen(port, () => {
            console.log("MelShop, Server start on port: " + port + "\n");
        });
    })
    .catch(err => {
        console.log(err);
    });