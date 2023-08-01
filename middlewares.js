const User = require('./model/user');

const adminAuthenticate = (req, res, next) => {
    // if (req.session && req.session.adminLoggedIn) {
    //     next();
    // } else {
    //     return res.redirect('/admin/login');
    // }
    next();
}


const userAuthenticate = async (req, res, next) => {
    if (req.session && req.session.userLoggedIn) {
        try {
            const user = await User.findById(req.session.userId);
            if (user.blocked) {
                return res.send("<script> alert('Your account is blocked') </script>");
            } else {
                next();
            }
        } catch(err) {
            return console.log(err.message);
        }
    } else {
        next();
    }
}


module.exports = {adminAuthenticate, userAuthenticate};