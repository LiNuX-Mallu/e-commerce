const Banner = require('../../model/banner');

module.exports = async (req, res) => {
    try {
        const deleted = await Banner.deleteOne({_id: req.params.bannerId});
        if (deleted.deletedCount !== 0) {
            res.status(200).json({message: "Banner deleted successfully"});
        } else {
            throw new Error("Couldn't delete banner");
        }
    } catch(err) {
        res.status(500).json({error: err.message || err || "Internal server error"});
    }
}