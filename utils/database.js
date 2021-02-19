const Sequelize = require('sequelize');

const sequelize = new Sequelize('shop-sequelize', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;