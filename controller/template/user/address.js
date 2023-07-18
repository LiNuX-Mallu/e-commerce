const User = require('../../../model/user');

const address = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.session.userId});
        if (user) {
            res.status(200).render('user/accountComponents/address', {address: user.address});
        } else {
            res.status(500).json({error: 'Internal server error'});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
}

const addAddress = (req, res) => {
    res.status(200).render('user/accountComponents/add-address');
}

module.exports = {address, addAddress};