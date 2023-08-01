const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid 6-digit ID!`
        }
    },
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

orderSchema.pre('save', function (next) {
    this.orderId = Math.floor(100000 + Math.random() * 900000).toString();
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;