const Product = require('../../../model/product');
const User = require('../../../model/user');

module.exports = async (req, res) => {
    try {
        const result = await Product.findOne({_id: req.params.id});
        let user;
        if (req.session.userLoggedIn) {
            user = await User.findById(req.session.userId);
        }
        if (result && user) {
            res.render('user/product', {product: result, user});
        } else if (!user && result) {
            res.render('user/product', {product: result, user: false});
        } else {
            res.status(500).send("Internal server error");
        }
    } catch(err) {
        res.status(500).send("Internal server error");
        console.log(err);
    }
}