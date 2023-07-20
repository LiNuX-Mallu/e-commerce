const User = require('../../model/user');

module.exports = async (req, res) => {
    const itemId = req.params.itemId;
    try {
        const deleted = await User.updateOne(
            {_id: req.session.userId},
            {$pull: {cart: {_id: itemId}}}
        );
        if (deleted.acknowledged && deleted.modifiedCount !== 0) {
            res.status(200).json({message: "Item removed from cart"});
        } else {
            throw new Error("Couldn't remove item from cart");
        }
    } catch(err) {
        res.status(500).json({error: err.message || "Internal server error"});
    }
}