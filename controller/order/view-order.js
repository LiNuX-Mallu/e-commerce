const Order = require('../../model/order');

module.exports = async (req, res) => {
    if (!req.session.userLoggedIn) {
        return res.redirect('/login');
    }
    const orderId = req.params.orderId;
    try {
        const order = await Order.findOne({orderId}).populate({path: 'orderItems.productId', model: 'Product'});
        if (order) {
            return res.render('user/view-order', {order});
        } else {
            throw new Error("Couldn't find order with given orderId");
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}