const Coupon = require('../../../model/coupon');

module.exports = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.couponId);
        if (coupon) {
            res.render('admin/edit-coupon', {coupon});
        } else {
            throw new Error();
        }
    } catch(err) {
        res.status(500).send('Internal server error');
    }
}