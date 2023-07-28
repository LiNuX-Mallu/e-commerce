const Product = require('../../../model/product');
const User = require('../../../model/user');

module.exports = async (req, res) => {
    const {keyword} = req.body;
    const regex = new RegExp(keyword, 'i');

    try {
        const products = await Product.find({productName: regex});
        let user = await User.findById(req.session.userId).populate({path: 'cart'}).populate({path: 'cart.productId', model: 'Product'});
        user = (user) ? user : false;

        if (products) {
            res.render('user/shop', {products, user});
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}