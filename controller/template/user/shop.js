const Product = require('../../../model/product');
const User = require('../../../model/user');

module.exports = async (req, res) => {
    let result;
    try {
        if (req.params.category === "men") {
            console.log(11)
            result = await Product.find({notAvailable: false, "category.categoryName": "men"});
        } else if (req.params.category === "women") {
            result = await Product.find({notAvailable: false, "category.categoryName": "women"});
        } else if (req.params.category === "kids") {
            result = await Product.find({notAvailable: false, "category.categoryName": "kids"});
        } else {
            result = await Product.find({notAvailable: false});
        }
    } catch(err) {
        console.log(err);
        res.status(500).send('internal server error');
    }

    if (req.session && req.session.userLoggedIn) {
        if (result) {
            const user = await User.findById(req.session.userId).populate({path: 'cart'}).populate({path: 'cart.productId', model: 'Product'});
            if (user) {
                res.render('user/shop', {products: result, user});
            } else {
                delete req.session.userLoggedIn;
                delete req.session.userId;
                res.render('user/shop', {products: result, user: false});
            }
        } else {
            res.status(500).send('internal server error');
        }
        
    } else {
        if (result) {
            res.render('user/shop', {products: result, user: false});
        } else {
            res.status(500).send("Internal server error");
        }
    }
};