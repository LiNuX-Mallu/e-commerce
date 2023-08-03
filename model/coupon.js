const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponType: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        required: true
    },
    discountValue: {
        type: Number
    },
    minOrderAmount: {
        type: Number
    },
    maxOrderAmount: {
        type: Number
    },
    expireDate: {
        type: Date,
        required: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableCategoryOrProduct: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    userLimit: {
        type: Number,
        default: 1
    },
    description: {
        type: String
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId
    }]
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;