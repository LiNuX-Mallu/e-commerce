const User = require('../../model/user');
const {RAZOR_ID} = process.env;

module.exports = async (req, res) => {
    if (!req.session.userLoggedIn) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId)
        .populate({
            path: 'cart.productId',
            model: 'Product',
            populate: {
                path: 'category.categoryId',
                model: 'Category'
            }
        });

        if (user) {
            res.render('user/checkout', {user, RazorApiKey: RAZOR_ID});
        } else {
            throw new Error("Internal server error");
        }
    } catch(err) {
        res.status(500).send(err.message || "Internal server error");
    }
}