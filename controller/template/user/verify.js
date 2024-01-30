const axios = require('axios');

module.exports = async (req, res) => {
    const email = (req.params.email !== "false") ? req.params.email : false;
    //const phone = (req.params.phone !== "false") ? req.params.phone : false;
    const phone = false;
    try {
        res.render('user/verify', {email, phone});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
}