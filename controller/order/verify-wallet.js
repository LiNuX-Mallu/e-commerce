const Order = require('../../model/order');
const User = require('../../model/user');
const Product = require('../../model/product');

module.exports = async (req, res) => {
    const {orderId, result} = req.body;
    const userId = req.session.userId;
    try {
        if (!result) {
            await Order.deleteOne({_id: orderId});
            return res.status(200).end();
        }

        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('couldnt find order');
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('couldnt find user');
        }

        if (order.totalAmount > user.wallet.balance) {
            await Order.deleteOne({_id: orderId});
            return res.status(400).json({error: "Insufficient balance"});
        } else {
            user.wallet.balance -= order.totalAmount;
            order.paymentStatus = "success";
            order.orderStatus = "confirmed";
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
                res.status(200).json({message: "Order placed successfully", orderId: order.orderId});
            }
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
}