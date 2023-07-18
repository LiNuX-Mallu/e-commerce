const Product = require('../../model/product');

module.exports = async (req, res) => {
    const productId = req.body.productId;
    try {
        const updated = await Product.updateMany({_id: productId}, {$set: {notAvailable: true}});
        console.log(updated);
        if (updated.modifiedCount === 0) {
            throw new Error("couldn't delete product");
        } else {
            res.status(200).json({message: "product deleted successfully"});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}