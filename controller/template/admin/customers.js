const User = require('../../../model/user');

const viewCustomers = async (req, res) => {
    try {
        const users = await User.find();
        const count = await User.countDocuments();
        if (users && count) {
            res.render('admin/customers', {users, count});
        } else {
            throw new Error();
        }
    } catch(err) {
        res.status(500).send("internal server error");
    }  
}

const blockCustomer = async (req, res) => {
    const {userId} = req.body;
    try {
        const result = await User.findOne({_id: userId});
        if (!result) {
            throw new Error();
        }
        let block;
        if (!result.blocked) {
            block = true;
        } else {
            block = false;
        }
        const updated = await User.updateOne({_id: userId}, {$set: {blocked: block}});
        if (updated.modifiedCount !== 0) {
            res.status(200).json({blocked: block});
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log(1, err);
        res.status(500).json({error: "operation failed!"});
    }
}

module.exports = {viewCustomers, blockCustomer};