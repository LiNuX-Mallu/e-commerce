const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {type: String, required: true},
    description: {type: String, required: true},
    images: [{type: String}],
    price: {type: Number, required: true},
    category: {
        categoryName: {
            type: String,
            required: true
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    },
    
    sizeAndStock: {
        XS: {type: Number, default: 0},
        S: {type: Number, default: 0},
        M: {type: Number, default: 0},
        L: {type: Number, default: 0},
        XL: {type: Number, default: 0}
    },

    ratingAndReview: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
        }
    }],
    tags: [{
        type: String
    }],

    addedAt: {type: String},

    notAvailable: {
        type: Boolean,
        default: false
    }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;