const Category = require('../../../model/category');

module.exports = async (req, res) => {
    try {
        const result = await Category.findOne({_id: req.params.id});
        if (result) {
            res.render('admin/edit-category', {category: result});
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};