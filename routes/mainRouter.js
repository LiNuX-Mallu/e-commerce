const express = require('express');
const router = express.Router();

const home = require('../controller/template/user/home');
const register = require('../controller/template/user/register');
const verify = require('../controller/template/user/verify');
const login = require('../controller/template/user/login');
const {resetTemplate} = require('../controller/user/forgot-pass');
const shop = require('../controller/template/user/shop');
const product = require('../controller/template/user/product');


const account = require('../controller/template/user/account');
const profile = require('../controller/template/user/profile');
const {address, addAddress} = require('../controller/template/user/address');

const addToCart = require('../controller/cart/add-to-cart');
const getCart = require('../controller/cart/get-cart');

router.get('/', (req, res) => {
    res.redirect('/home');
});
router.get('/home', home);
router.get('/register', register);
router.get('/verify/:email/:phone', verify);
router.get('/login', login);
router.get('/reset-password/:uuid', resetTemplate);
router.get('/account', account);
router.get('/profile', profile);

router.get('/address', address);
router.get('/add-address', addAddress);

router.get('/shop', shop);
router.get('/product/:id', product);

//cart
router.post('/add-to-cart', addToCart);
router.get('/cart', getCart);

module.exports = router;