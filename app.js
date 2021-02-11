const http = require('http');
const path = require('path');
const rootDir = require('./utils/path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Filtering paths
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// If no request is intercepted
app.use((req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', '404.html'));
})

app.listen(3000);