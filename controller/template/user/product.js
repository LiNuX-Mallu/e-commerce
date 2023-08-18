const Product = require('../../../model/product');
const User = require('../../../model/user');

module.exports = async (req, res) => {
    try {
        const result = await Product.findOne({_id: req.params.id}).populate('category.categoryId', 'offer');
        const products = await Product.find({"category.categoryName": result.category.categoryName}).limit(4).populate('category.categoryId', 'offer');
        let user;
        if (req.session.userLoggedIn) {
            user = await User.findById(req.session.userId).populate({path: 'cart'}).populate({path: 'cart.productId', model: 'Product'});
        }
        if (result && user && products) {
            res.render('user/product', {product: result, user, products});
        } else if (!user && result && products) {
            res.render('user/product', {product: result, user: false, products});
        } else {
            res.status(500).send("Internal server error");
        }
    } catch(err) {
        res.status(500).send("Internal server error");
        console.log(err);
    }
}