const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
// folder public -> css (make accessible)
app.use(express.static(path.join(__dirname, 'public')));

// Filtering paths
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// If no request is intercepted
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(3000);