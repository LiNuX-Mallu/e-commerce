const Product = require('../../../model/product');

module.exports = async (req, res) => {
    try {
        const result = await Product.find({notAvailable: false});
        const count = await Product.countDocuments({notAvailable: false});
        if (result && count) {
            return res.render('admin/products', {products: result, count});
        } else {
            throw new Error("couldnt find products");
        }
    } catch(err) {
        res.status(500).send("Internal server error");
        console.log(err);
    }
}