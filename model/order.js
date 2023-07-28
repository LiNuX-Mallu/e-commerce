const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true
    },
    orderItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        color: {
            type: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },

    shippingAddress: {
        customerName: {
            type: String,
            required: true
        },
        addressType: {
            type: String,
            required: true
        },
        contactNumber: {
            type: Number,
            required: true,
        },
        houseNumber: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        landmark: {
            type: String,
        }
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    orderStatus: {
        type: String,
        default: "pending"
    },
    trackInfo: {
        trackId: Number,
        deliveryDate: Date
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;