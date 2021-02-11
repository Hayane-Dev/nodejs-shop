const express = require('express');
const router = express.Router();

// Warning: exact matching... with use an url like /dsfdsf works but with get it does not work !!!
router.get('/', (req, res, next) => {
    res.send('<h1>Hello from Express.js</h1>');
});

module.exports = router;