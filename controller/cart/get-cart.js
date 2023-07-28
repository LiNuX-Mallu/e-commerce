const User = require('../../model/user');

module.exports = async (req, res) => {
    if (!req.session.userLoggedIn) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId).populate({path: 'cart'}).populate({path: 'cart.productId', model: 'Product'});
        if (user) {
            res.render('user/cart', {user});
        } else {
            throw new Error("Cannot find user");
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
};