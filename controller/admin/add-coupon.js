const Coupon = require('../../model/coupon');

module.exports = async (req, res) => {
    try {
        const newCoupon = new Coupon(req.body);
        const saved = await newCoupon.save();
        if (saved) {
            res.status(200).json({message: "Added successfully"});
        } else throw new Error("fail adding new coupon");
    } catch(err) {
        res.status(500).json({error: err?.message || "Internal server error"});
    }
}