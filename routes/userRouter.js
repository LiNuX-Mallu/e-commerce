const express = require('express');
const router = express.Router();

const userRegister = require('../controller/user/register');
const userLogin = require('../controller/user/login');
const {forgotPass} = require('../controller/user/forgot-pass');
const {resetPass} = require('../controller/user/forgot-pass');
const editProfile = require('../controller/user/edit-profile');
const {saveAddress, deleteAddress, editAddress} = require('../controller/user/address-operations');

router.get('/logout', (req, res) => {
    delete req.session.userLoggedIn;
    delete req.session.userId;
    res.status(200).redirect('/login');
})

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/forgot-password', forgotPass);
router.post('/reset-password', resetPass);
router.put('/edit-profile', editProfile);

router.post('/add-address', saveAddress);
router.delete('/delete-address/:addressId', deleteAddress);
router.put('/edit-address', editAddress);

module.exports = router;