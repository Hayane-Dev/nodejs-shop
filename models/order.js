const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        // We want more than the id of the product, the product object in his whole
        product: { type: Object, require: true },
        quantity: { type: Number, required: true }
    }],
    user: {
        name: { type: String, required: true },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);