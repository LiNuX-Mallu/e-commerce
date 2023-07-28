const Product = require('../../../model/product');

module.exports = async (req, res) => {
    try {
        let result, count;
        if (req.params.status === "notAvailable") {
            result = await Product.find({notAvailable: true});
            count = await Product.countDocuments({notAvailable: true});
        } else {
            result = await Product.find({notAvailable: false});
            count = await Product.countDocuments({notAvailable: false});
        }
        
        if (result && count) {
            return res.render('admin/products', {products: result, count});
        } else {
            throw new Error("No removed products");
        }
    } catch(err) {
        res.status(500).send(err.message || "Internal server error");
        console.log(err.message || err);
    }
}