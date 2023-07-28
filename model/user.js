const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: Number, required: true},
    order_history: [{
        type: mongoose.Schema.Types.ObjectId, ref:'Order'
    }],
    gender: {type: String, required: true},
    dob: {type: Date, required: true},
    
    verified: {
        email: {type: Boolean, default: false},
        phone: {type: Boolean, default: false},
    },
    blocked: {type: Boolean, default: false},

    address: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        customerName: {type: String, required: true},
        contactNumber: {type: String, required: true},
        addressType: {type: String, required: true},
        houseNumber: {type: String, required: true},
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, default: "india"},
        pincode: {type: Number, required: true},
        landmark: {type: String},
        defaulted: {type: Boolean}
    }],

    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {type: Number, required: true},
        size: {type: String, required: true},
        color: {type: String}
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;