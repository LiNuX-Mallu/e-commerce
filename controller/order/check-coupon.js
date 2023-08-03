const Coupon = require('../../model/coupon');

module.exports = async (req, res) => {
    const {totalAmount, couponCode} = req.body;
    try {
        const coupon = await Coupon.findOne({couponCode: couponCode.toLowerCase()});
        if (coupon) {
            if ((+totalAmount - 40) < coupon.minOrderAmount) {
                return res.status(400).json({error: 'does not meet minimum order amount'});
            }
            if (coupon.expireDate < Date.now() || coupon.usedBy.includes(req.session.userId)) {
                throw new Error();
            }
            let money;
            if (coupon.couponType === "freeDelivery") {
                money = 40;
            } else if (coupon.couponType === "percentageDiscount") {
                money = +totalAmount * (coupon.discountValue / 100);
            } else if (coupon.couponType === "fixedPriceDiscount") {
                money = coupon.discountValue;
            }
            return res.status(200).json({money});
        } else {
            throw new Error();
        } 
    } catch(err) {
        res.status(404).json({error: 'Invalid coupon'});
    }
}