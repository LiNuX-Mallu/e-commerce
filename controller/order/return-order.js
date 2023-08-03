const Order = require('../../model/order');
const User = require('../../model/user');
const Product = require('../../model/product');

module.exports = async (req, res) => {
    const {orderId} = req.body;
    try {
        const order = await Order.findById(orderId);
        if (order) {
            if ((order.trackInfo.deliveryDate + 2) > Date.now()) {
                return res.status(400).json({error: "You cannot return after 2 days of delivery"});
            }
            for (const item of order.orderItems) {
                const product = await Product.findById(item.productId);
                product.sizeAndStock[item.size] += item.quantity;
                const saved = await product.save();
                if (!saved) {
                    throw new Error("updated product stock error");
                }
            }
            if (order.paymentMethod === "razorpay") {
                const user = await User.findById(req.session.userId);
                if (user) {
                    user.wallet.balance += order.totalAmount - order.couponMoney;
                    const saved = user.save();
                    if (saved) {
                        order.orderStatus = "returned";
                        const saved = await order.save();
                        if (saved) {
                            res.status(200).json({message: "Order returned, Refund amount will be reflected your wallet"});
                        } else {
                            throw new Error("order cancel update error");
                        }
                    } else {
                        throw new Error("refund error");
                    }
                } else {
                    throw new Error();
                }
            } else {
                order.orderStatus = "returned";
                const saved = await order.save();
                if (saved) {
                    res.status(200).json({message: "Order returned successfully"});
                } else {
                    throw new Error("order refund update error");
                }
            }
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}