const Category = require('../../../model/category');

module.exports = async (req, res) => {
    try {
        const result = await Category.find({notAvailable: false});
        const count = await Category.countDocuments({notAvailable: false});
        res.render('admin/category', {count, categories: result});

    } catch(err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
    res.render('admin/category');
};