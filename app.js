const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');



const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
// folder public -> css (make accessible)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for storing an user
app.use((req, res, next) => {
    User.findById('6031bd133eccf23354f1a0f3')
        .then(user => {
            req.user = user; // Full user object Mongoose
            next();
        })
});

// Filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// If no request is intercepted
app.use(errorController.get404);

mongoose
    .connect('mongodb+srv://mek:mekibnmek@cluster0.akhve.mongodb.net/melShop', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Mel',
                        email: 'mel@test.com',
                        cart: {
                            item: []
                        }
                    });
                    return user.save();
                }
            })
            .then(() => {
                app.listen(port, () => {
                    console.log("MelShop, Server start on port: " + port + "\n");
                });
            })
            .catch(err => {
                console.log(err);
            });
    })
    .catch(err => {
        console.log(err);
    });