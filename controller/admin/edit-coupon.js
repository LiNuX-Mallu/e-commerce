const Coupon = require('../../model/coupon');

module.exports = async (req, res) => {
    try {
        const updated = await Coupon.updateOne({_id: req.body.couponId}, req.body);
        if (updated.modifiedCount === 0 && updated.matchedCount !== 0) {
            res.status(400).json({error: "Nothing to update"})
        } else if (updated.modifiedCount > 0) {
            res.status(200).json({message: "Coupon edited successfully"});
        } else if (!updated.acknowledged || updated.matchedCount === 0) {
            throw new Error("Internal server error");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}