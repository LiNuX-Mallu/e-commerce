const User = require('../../model/user');
const Product = require('../../model/product');

module.exports = async (req, res) => {
    const {bool, productId, size} = req.body;

    try {
        const user = await User.findOne({_id: req.session.userId, "cart.productId": productId, "cart.size": size});
        const productDetails = await Product.findById(productId);
        if (!user || !productDetails) {
            return res.status(500).json({error: "Internal server error"});
        }

        const item = user.cart.find(item => {
            if (item.productId.toString() === productId && item.size === size) {
                return item;
            }
        });

        if (!bool) {
            if (item.quantity > 0) {
                item.quantity--;
                await user.save();
                res.status(200).end();
            } else {
                return res.status(400).json({error: "Cannot be lesser than 0"})
            }
        } else {
            const product = await Product.findById(productId);
            if ((item.quantity) < product.sizeAndStock[size]) {
                item.quantity++;
                await user.save();
                res.status(200).end();
            } else {
                return res.status(400).json({error: "Stock unavailable"});
            }
        }

    } catch(err) {
        console.log(err);
        res.status(400).json({error: "Internal server error"});
    }
}