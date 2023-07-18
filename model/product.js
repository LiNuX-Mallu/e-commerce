const mongoose = require('mongoose');
const Category = require('./category');

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
    },
});


// productSchema.pre('save', async function(next) {
//     const productId = this._id;
//     const newCategory = this.category;
//     try {
//         const category = await Category.findOne({categoryName: newCategory, notAvailable: false});
//         if (category) {
//             category.products.push(productId);
//             await category.save();
//             next();
//         } else {
//             throw new Error('category does not exist');
//         }
//     } catch(err) {
//         console.log('error adding product into category');
//         throw err;
//     }
// });

// productSchema.pre('updateOne', async function(next) {
//     const productId = this.getQuery()._id;
//     const updateDocument = this.getUpdate();
//     console.log(updateDocument.notAvailable);
//     if (updateDocument.notAvailable) {
//         next();
//         return;
//     }
//     const oldCategory = await this.model.findById(productId);
//     const newCategory = updateDocument.category;
//     console.log(oldCategory.category, newCategory);
    

//     if (oldCategory.category === newCategory) {
//         next();
//         return;
//     }
//     try {
//         const removed = await Category.updateOne({categoryName: oldCategory.category}, {
//             $pull: {
//                 products: {
//                     $in: [productId]
//                 }
//             }
//         });
//         const category = await Category.findOne({categoryName: newCategory, notAvailable: false});
//         if (category) {
//             category.products.push(productId);
//             await category.save();
//             next();
//         } else {
//             throw new Error('category does not exist');
//         }
//     } catch(err) {
//         console.log('error adding product into category');
//         throw err;
//     }
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;