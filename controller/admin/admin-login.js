const Admin = require('../../model/admin');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await Admin.findOne({email: email});
        if (result) {
            if (await bcrypt.compare(password, result.password)) {
                req.session.adminLoggedIn = true;
                req.session.adminName = result.name;
                return res.status(200).json({message: "login successful"});
            } else {
                return res.status(400).json({error: "Incorrect email or password"});
            }
        } else {
            return res.status(400).json({error: "No user found with this email ID"})
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
}