const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true,
    },
    image: {
        type: String,
        required: true,
        default: '',
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    
    description: {
        type:String,
        required: false,
        default: ''
    },
    addons: {
        type: Array, required: false, default: []
    }
   
    
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
