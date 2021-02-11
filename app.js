const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// If no request is intercepted
app.use((req, res, next) => {
    // res.send(`
    res.status(404).send(`
        <h1>404 Error: Page not found</h1>
    `);
})

app.listen(3000);