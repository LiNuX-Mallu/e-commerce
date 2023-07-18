const User = require('../../model/user');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    // const csrfToken = req.body._csrf;
    // console.log(csrfToken);
    // if (req.csrfToken() !== csrfToken) {
    //     return res.status(403).send({error: "CSRF protection: Invalid token"});
    // }
    const {user, password} = req.body;
    try {
        let response;
        const isString = (isNaN(+user));
        if (isString) {
            response = await User.findOne({email: user});
        } else {
            response = await User.findOne({phone: user});
        }
        if (await bcrypt.compare(password, response.password)) {
            req.session.userLoggedIn = true;
            req.session.userId = response._id;

            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);

            res.cookie('sessionID', req.sessionID, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                //expires: expireDate,
            });

            res.status(200).json({error: "login succcessfull"});
        } else {
            if (isString) {
                res.status(400).json({error: "incorrect email address or password"});
            } else {
                res.status(400).json({error: "incorrect phone number or password"});
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
}