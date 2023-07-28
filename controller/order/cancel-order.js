const Order = require('../../model/order');

module.exports = async (req, res) => {
    const {orderId} = req.body;
    try {
        const cancelled = await Order.updateOne({_id: orderId}, {$set: {orderStatus: "cancelled"}});

        if (cancelled.modifiedCount !== 0) {
            res.status(200).json({message: "Order cancelled"});
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}