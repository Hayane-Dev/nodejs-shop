const http = require('http');

const express = require('express');

const app = express();

// All the request url start with '/', so this middleware is alwakys asked
app.use('/', (req, res, next) => {
    console.log('This middleware always runs !');
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log('In the middleware');
    res.send('<h1>Add product page</h1>');
});

// We have to put it in the end, if not the url /add-product is never reached !
app.use('/', (req, res, next) => {
    console.log('In another middleware');
    res.send('<h1>Hello from Express.js</h1>');
});


app.listen(3000);