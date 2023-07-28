const Order = require('../../../model/order');

module.exports = async (req, res) => {
    try {
        const orders = await Order.find().populate({path: 'orderItems.productId', model: 'Product'});
        const count = await Order.countDocuments();
        if (orders) {
            res.render('admin/orders', {orders, count});
        } else {
            res.render("admin/orders", {orders: false, count: false});
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}