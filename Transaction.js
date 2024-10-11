
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    sold: { type: Boolean, default: false },
    dateOfSale: { type: Date, required: true },
    image: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
