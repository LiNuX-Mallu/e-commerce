const Category = require('../../model/category');

module.exports = async (req, res) => {
    try {
        const updated = await Category.updateOne({_id: req.body.categoryId}, {$set: {notAvailable: true}});
        if (updated.modifiedCount !== 0) {
            res.status(200).json({message: "category deleted"});
        } else {
            throw new Error();
        }
    } catch(err) {
        res.status(500).json({error: "Couldn't delete category"});
    }
}