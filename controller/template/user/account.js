module.exports = async (req, res) => {
    if (!req.session.userLoggedIn) {
        return res.redirect('/login');
    }
    res.render('user/account');
}