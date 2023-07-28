const express = require('express');
const router = express.Router();

const home = require('../controller/template/user/home');
const register = require('../controller/template/user/register');
const verify = require('../controller/template/user/verify');
const login = require('../controller/template/user/login');
const {resetTemplate} = require('../controller/user/forgot-pass');
const shop = require('../controller/template/user/shop');
const product = require('../controller/template/user/product');
const searchProduct = require('../controller/template/user/searchProduct');


const account = require('../controller/template/user/account');
const profile = require('../controller/template/user/profile');
const {address, addAddress} = require('../controller/template/user/address');
const orders = require('../controller/template/user/orders');

const addToCart = require('../controller/cart/add-to-cart');
const getCart = require('../controller/cart/get-cart');
const removeFromCart = require('../controller/cart/remove-from-cart');
const updateCartQuantity = require('../controller/cart/update-quantity');
const checkout = require('../controller/cart/checkout');

const makeOrder = require('../controller/order/make-order');
const cancelOrder = require('../controller/order/cancel-order');

const {userAuthenticate} = require('../middlewares');


router.get('/', (req, res) => {
    res.redirect('/home');
});
router.get('/home', userAuthenticate, home);
router.get('/register', register);
router.get('/verify/:email/:phone', verify);
router.get('/login', login);
router.get('/reset-password/:uuid', resetTemplate);
router.get('/account', userAuthenticate, account);
router.get('/profile', userAuthenticate, profile);
router.post('/search-product', userAuthenticate, searchProduct);

router.get('/address', userAuthenticate, address);
router.get('/add-address', userAuthenticate, addAddress);

router.get('/orders', userAuthenticate, orders);

router.get('/shop', userAuthenticate, shop);
router.get('/shop/:category', userAuthenticate, shop);

router.get('/product/:id', userAuthenticate, product);

//cart
router.post('/add-to-cart', userAuthenticate, addToCart);
router.get('/cart', userAuthenticate, getCart);
router.delete('/remove-from-cart/:itemId', userAuthenticate, removeFromCart);
router.put('/update-cart-quantity', userAuthenticate, updateCartQuantity);

//checkout
router.get('/checkout', userAuthenticate, checkout);

//order
router.post('/make-order', userAuthenticate, makeOrder);
router.put('/cancel-order', userAuthenticate, cancelOrder);

module.exports = router;