const User = require('../../../model/user');

module.exports = async (req, res) => {
    if (req.session && req.session.userLoggedIn) {
        try {
            const user = await User.findOne({_id: req.session.userId});
            if (user) {
                res.render('user/home', {user});
            } else {
                delete req.session.userLoggedIn;
                delete req.session.userId;
                res.render('user/home', {user: false});
            }
        } catch(err) {
            delete req.session.userLoggedIn;
            delete req.session.userId;
            res.render('user/home', {user: false});
        }
    } else {
        res.render('user/home', {user: false});
    }   
};