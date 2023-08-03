const Order = require('../../model/order');

module.exports = async (req, res) => {
    const {orderId} = req.body;
    try {
        const order = await Order.findById(orderId);
        if (order) {
            order.orderStatus = "delivered";
            order.trackInfo.deliveryDate = Date.now();
            const saved = await order.save();
            if (saved) {
                return res.status(200).json({message: "Order delivered"});
            } else {
                throw new Error("cannot save order error");
            }
        } else {
            throw new Error('cant find order error');
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}