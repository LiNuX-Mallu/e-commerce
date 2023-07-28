const User = require('../../model/user');

module.exports = async (req, res) => {
    if (!req.session.userLoggedIn) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId).populate({path: 'cart'}).populate({path: 'cart.productId', model: 'Product'});
        if (user) {
            res.render('user/checkout', {user});
        } else {
            throw new Error("Internal server error");
        }
    } catch(err) {
        res.status(500).send(err.message || "Internal server error");
    }
}