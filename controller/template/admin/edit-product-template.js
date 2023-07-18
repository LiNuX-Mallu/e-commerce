const Product = require('../../../model/product');

module.exports = async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await Product.findOne({_id: productId});
        if (result) {
            res.render('admin/edit-product', {product: result});
        } else {
            throw new Error("couldn't find product");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("internal server error");
    }
}