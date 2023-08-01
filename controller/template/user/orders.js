const Order = require('../../../model/order');

module.exports = async (req, res) => {
    if (!req.session || !req.session.userLoggedIn) {
        return res.redirect('/login');
    }
    try {
        const orders = await Order.find({userId: req.session.userId}).populate({path: 'orderItems.productId', model: 'Product'}).sort({orderDate: -1});
        if (orders) {
            res.render('user/accountComponents/orders', {orders});
        } else {
            res.render("user/accountComponents/orders", {orders: false});
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}