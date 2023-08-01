module.exports = async (req, res) => {
    delete req.session.adminLoggedIn;
    delete req.session.adminName;
    res.redirect('/admin/login');
}