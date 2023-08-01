const Coupon = require('../../../model/coupon');

module.exports = async (req, res) => {
    try {
        const coupon = await Coupon.find();
        const count = await Coupon.countDocuments();
        if (coupon) {
            res.render('admin/coupon', {coupon, count});
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
}