const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('In the middleware');
    next();
});

app.use((req, res, next) => {
    console.log('In another middleware');
    // We can use res....write...headers...like before but express works for us, he had automatically what we need (ex content-type html...... headers...)
    res.send('<h1>Hello from Express.js</h1>');

});

const server = http.createServer(app);

server.listen(3000);