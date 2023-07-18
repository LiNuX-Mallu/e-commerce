const User = require('../../model/user');

module.exports = async (req, res) => {
    const {quantity} = req.body;
    if (!req.body.size) {
        return res.status(400).json({error: "please choose a size"});
    }
    const product = req.body;
    try {
        if (await User.findOne({_id: req.session.userId, "cart.productId": req.body.productId, "cart.size": req.body.size})) {
            const increment = await User.updateOne(
                {_id: req.session.userId, "cart.productId": req.body.productId, "cart.size": req.body.size},
                {$inc: {"cart.$.quantity": quantity}}
            );
            if (increment.modifiedCount !== 0) {
                return res.status(200).json({message: "Added to cart"});
            } else {
                throw new Error("Internal server error");
            }
        }
        const user = await User.findById(req.session.userId);
        if (user) {
            user.cart.push(product);
            const added = await user.save();
            if (added) {
                res.status(200).json({message: "Added to cart"});
            } else {
                throw new Error("couldn't add to cart");
            }
        } else {
            throw new Error('internal server error');
        }
    } catch(err) {
        res.status(500).json({error: err.message || "Internal server error"});
    }
}