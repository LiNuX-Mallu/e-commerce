const Order = require('../../model/order');
const Product = require('../../model/product');
const User = require('../../model/user');

module.exports = async (req, res) => {
    const {orderId} = req.body;
    try {
        const order = await Order.findById(orderId);
        if (order) {
            for (const item of order.orderItems) {
                const product = await Product.findById(item.productId);
                product.sizeAndStock[item.size] += item.quantity;
                const saved = await product.save();
                if (!saved) {
                    throw new Error("updated product stock error");
                }
            }
            if (order.paymentMethod === "razorpay" || order.paymentMethod === "walletPay") {
                const user = await User.findById(req.session.userId);
                if (user) {
                    user.wallet.balance += order.totalAmount - order.couponMoney;
                    const saved = user.save();
                    if (saved) {
                        order.orderStatus = "cancelled";
                        const saved = await order.save();
                        if (saved) {
                            res.status(200).json({message: "Order cancelled, Refund amount will be reflected your wallet"});
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
                order.orderStatus = "cancelled";
                const saved = await order.save();
                if (saved) {
                    res.status(200).json({message: "Order cancelled successfully"});
                } else {
                    throw new Error("order cancel update error");
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