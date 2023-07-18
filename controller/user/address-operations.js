const User = require('../../model/user');

const saveAddress = async (req, res) => {
    const formData = req.body;
    try {
        const user = await User.findById(req.session.userId);
        if (user) {
            user.address.push(formData);
            const saved = await user.save();
            if (saved) {
                res.status(200).json({message: "Address saved successfully"});
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}

const deleteAddress = async (req, res) => {
    try {
        const deleted = await User.updateOne(
            {_id: req.session.userId},
            {$pull: {address: {_id: req.params.addressId}}}
        );
        if (deleted.modifiedCount !== 0) {
            res.status(200).json({message: "Address successfully deleted"});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

const editAddress = async (req, res) => {
    const formData = req.body;
    delete formData._id;
    try {
        const updated = await User.updateOne({_id: req.session.userId, "address._id": req.body.addressId}, { $set: { "address.$": formData }});
        if (updated && updated.acknowledged && updated.modifiedCount !== 0) {
            res.status(200).json({message: "Address edited successfully"});
        } else {
            throw new Error("Couldn't update address");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err || "Internal server error"});
    }
}

module.exports = {saveAddress, deleteAddress, editAddress};