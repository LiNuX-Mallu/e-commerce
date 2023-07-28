const Product = require('../../model/product');

module.exports = async (req, res) => {
    const productId = req.body.productId;
    try {
        const updated = await Product.updateMany({_id: productId}, {$set: {notAvailable: true}});
        if (updated.matchedCount !== 0 && updated.modifiedCount === 0) {
            const added = await Product.updateMany({_id: productId}, {$set: {notAvailable: false}});
            if (added.modifiedCount !==0 ) {
                return res.status(200).json({message: "product added back successfully"});
            } else {
                throw new Error("Could not add back product");
            }
        } else if (updated.modifiedCount !== 0) {
            res.status(200).json({message: "product deleted successfully"});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}