const path = require('path');
const express = require('express');
const rootDir = require('../utils/path');

const router = express.Router();

// Warning: exact matching... with use an url like /dsfdsf works but with get it does not work !!!
router.get('/', (req, res, next) => {
    // Does not work ... relative path
    // res.sendFile('./views/shop.html');
    // Each argument is a part of the absolute path
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;