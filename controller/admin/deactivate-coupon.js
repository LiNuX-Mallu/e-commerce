const Coupon = require('../../model/coupon');

module.exports = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.body.couponId);
        coupon.isActive = (coupon.isActive) ? false : true;
        const saved = await coupon.save();
        if (saved) {
            res.status(200).json({message: "Deactivated successfully"});
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}