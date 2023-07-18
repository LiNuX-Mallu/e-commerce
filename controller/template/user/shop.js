const Product = require('../../../model/product');
const User = require('../../../model/user');

module.exports = async (req, res) => {
    if (req.session && req.session.userLoggedIn) {
        try {
            const result = await Product.find({notAvailable: false});
            if (result) {
                const user = await User.findOne({_id: req.session.userId});
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
        } catch(err) {
            console.log(err);
            res.status(500).send('internal server error');
        }
    } else {
        const result = await Product.find({notAvailable: false});
        if (result) {
            res.render('user/shop', {products: result, user: false});
        } else {
            res.status(500).send("Internal server error");
        }
    }
};