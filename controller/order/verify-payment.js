const {RAZOR_SECRET, RAZOR_ID} = process.env;
const Order = require('../../model/order');
const User = require('../../model/user');
const Product = require('../../model/product');

const razorpay = require('razorpay');

const rzp = new razorpay({
    key_id: RAZOR_ID,
    key_secret: RAZOR_SECRET
});

module.exports = async (req, res) => {
    const {orderId, paymentResponse} = req.body;
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            throw new Error('user find error');
        }
        const order = await Order.findById(orderId);
        if (order && paymentResponse) {
            order.orderStatus = "confirmed";
            order.paymentStatus = "success";
            const ordered = await order.save();
            if (ordered) {
                const stockUpdater = user.cart.map(async (item) => {
                    const product = await Product.findById(item.productId);
                    product.sizeAndStock[item.size] -= item.quantity;
                    return product.save();
                });
                await Promise.all(stockUpdater);
                user.cart = [];
                await user.save();
            }
            return res.status(200).json({orderId: ordered.orderId});
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Payment failed"});
    }
}