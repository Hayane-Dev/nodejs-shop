const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send(`
        <h1>Add product page</h1>
        <form action="/product" method="POST">
            <input type="text" name="title" value="book"><button type="submit">Send</button>
        </form>
    `);
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;