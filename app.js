const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
// folder public -> css (make accessible)
app.use(express.static(path.join(__dirname, 'public')));

// Filtering paths
app.use('/admin', adminData.routes);
app.use(shopRoutes);

// If no request is intercepted
app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found', path: '' });
})

app.listen(3000);