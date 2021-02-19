const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

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

// Call Sequelize ... Creating tables if needed...there is a check...
sequelize
    .sync()
    .then(result => {
        console.log(result);
        app.listen(3000, () => {
            console.log("MelShop, Server start on port 3000");
        });
    })
    .catch(err => {
        console.log(err);
    });