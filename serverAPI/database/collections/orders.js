const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    number : { type: Number, default: 0},
    orderType: String,
    paymentType: String,
    isPaid: { type: Boolean, default: false },
    isReady: { type: Boolean, default: false },
    inProgress: { type: Boolean, default: true },
    isCanceled: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    itemsPrice: Number,
    taxPrice: Number,
    orderItems: [
        {
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
},
{
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
