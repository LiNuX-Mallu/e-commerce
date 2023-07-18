const User = require('../../model/user');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    const formData = req.body;
    try {
        if (formData.newPassword && formData.currentPassword) {
            const user = await User.findOne({_id: req.session.userId});
            if (await bcrypt.compare(formData.currentPassword, user.password)) {
                formData.password = await bcrypt.hash(formData.newPassword, 10);
            } else {
                return res.status(400).json({error: "Incorrect current password"});
            }
        }
        const updated = await User.updateOne({_id: req.session.userId}, formData);
        console.log(updated);
        if (updated.matchedCount === 0) {
            throw new Error("something went wrong");
        } else if (updated.modifiedCount === 0) {
            return res.status(200).json({message: "no changes"});
        } else {
            res.status(200).json({message: "saved successfully"});
        }
    } catch(err) {
        res.status(500).json({error: err});
    }
}