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
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
// folder public -> css (make accessible)
app.use(express.static(path.join(__dirname, 'public')));

// Storing the user into the request in order to share it
app.use((req, res, next) => {
    User
        .findByPk(1)
        .then(user => {
            // Sequelize object (User object...!!!) with all the methods...magic 
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// Filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// If no request is intercepted
app.use(errorController.get404);

// Associations
// User/Product
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
// User/Cart
User.hasOne(Cart);
Cart.belongsTo(User);
// Cart/Product
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Call Sequelize ... Creating tables if needed...there is a check...
// First lines executed...before the middlewares
sequelize
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Mel', email: 'test@test.com', password: '*****' })
        }
        return user;
    })
    .then((user) => {
        // console.log('user:', user);
        // Creating the cart, magic method
        return user.createCart();
    })
    .then(cart => {
        console.log('cart:', cart);
        app.listen(port, () => {
            console.log("MelShop, Server start on port: " + port + "\n");
        });
    })
    .catch(err => {
        console.log(err);
    });