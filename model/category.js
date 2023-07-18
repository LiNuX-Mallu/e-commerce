const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {type: String, required: true},
    description: {type: String},
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    images: [{
        type: String,
        required: true
    }],
    addedAt: {
        type: String,
        required: true
    },
    notAvailable: {
        type: Boolean,
        default: false
    }
});



const Category = mongoose.model('Category', categorySchema);

module.exports = Category;