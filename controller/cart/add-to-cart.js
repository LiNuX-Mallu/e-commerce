const User = require('../../model/user');
const Product = require('../../model/product');

module.exports = async (req, res) => {
    if (!req.session.userLoggedIn) {
        return res.status(303).end();
    }
    const {quantity} = req.body;
    if (!req.body.size) {
        return res.status(400).json({error: "please choose a size"});
    }
    const product = req.body;
    try {
        const productDetails = await Product.findById(req.body.productId);
        if (!productDetails) {
            throw new Error("Internal server error");
        }
        
        const userAlreadyHave = await User.findOne({_id: req.session.userId, "cart.productId": req.body.productId, "cart.size": req.body.size});
        if (userAlreadyHave) {
            const existingItem = userAlreadyHave.cart.find(item => {
                if (item.productId.toString() === req.body.productId && item.size === req.body.size) {
                    return item;
                }
            });

            const stock = (+quantity) + (+existingItem.quantity);

            if (productDetails.sizeAndStock[req.body.size] < stock) {
                return res.status(404).json({error: "We are sorry, stock unavailable", option: `you can pick upto ${productDetails.sizeAndStock[req.body.size] - existingItem.quantity}`});
            }

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

        if (productDetails.sizeAndStock[req.body.size] < quantity) {
            return res.status(404).json({error: "We are sorry, stock unavailable", option: `You can pick upto ${productDetails.sizeAndStock[req.body.size]}`});
        }
        const user = await User.findById(req.session.userId);
        if (user) {
            user.cart.push(product);
            const added = await user.save();
            if (added) {
                res.status(200).json({message: "Added to cart", length: user.cart.length});
            } else {
                throw new Error("couldn't add to cart");
            }
        } else {
            throw new Error('internal server error');
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err.message || "Internal server error"});
    }
}