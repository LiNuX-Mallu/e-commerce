const User = require('../../model/user');

module.exports = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (user) {
            res.render('user/cart', {cart: user.cart});
        } else {
            throw new Error("Cannot find user");
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
};