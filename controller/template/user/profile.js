const User = require('../../../model/user');

module.exports = async (req, res) => {
    if (!req.session || !req.session.userLoggedIn) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (user) {
            res.status(200).render('user/accountComponents/profile', {user});
        } else {
            res.status(404).send("coulnt find account details");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error: Couldn't access profile"});
    };
}