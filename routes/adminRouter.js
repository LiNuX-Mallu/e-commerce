const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const login = require('../controller/template/admin/admin-login');
const logout = require('../controller/admin/logout');
const adminLogin = require('../controller/admin/admin-login.js');
const adminPanel = require('../controller/template/admin/panel');
const {viewCustomers, blockCustomer} = require('../controller/template/admin/customers');
const products = require('../controller/template/admin/products');
const category = require('../controller/template/admin/category');
const addProduct = require('../controller/admin/add-product');
const addProductTemplate = require('../controller/template/admin/add-product-template');
const deleteProduct = require('../controller/admin/delete-product');
const editProductTemplate = require('../controller/template/admin/edit-product-template');
const editProduct = require('../controller/admin/edit-product');

const addCategoryTemplate = require('../controller/template/admin/add-category-template');
const addCategory = require('../controller/admin/add-category');
const deleteCategory = require('../controller/admin/delete-category');
const editCategoryTemplate = require('../controller/template/admin/edit-category-template');
const editCategory = require('../controller/admin/edit-category');

const {mainBanner, instagramBanner, genderedBanner} = require('../controller/template/admin/banner');
const addNewBanner = require('../controller/admin/add-new-banner');
const editbanner = require('../controller/admin/edit-banner');
const deleteBanner = require('../controller/admin/delete-banner');

const orders = require('../controller/template/admin/orders');

const coupon = require('../controller/template/admin/coupon');
const addCouponTemplate = require('../controller/template/admin/add-coupon');
const addCoupon = require('../controller/admin/add-coupon');
const editCouponTemplate = require('../controller/template/admin/edit-coupon');
const editCoupon = require('../controller/admin/edit-coupon');
const deactivateCoupon = require('../controller/admin/deactivate-coupon');

const {adminAuthenticate} = require('../middlewares');
const authenticate = adminAuthenticate;

router.get('/', (req, res) => {
    if (req.session && req.session.adminLoggedIn) {
        res.redirect('/admin/panel');
    } else {
        res.redirect('/admin/login');
    }
});

router.get('/login', login);
router.post('/admin-login', adminLogin);
router.get('/panel', authenticate, adminPanel);
router.get('/logout', adminAuthenticate, logout);

router.get('/customers', authenticate, viewCustomers);
router.put('/block-customer', authenticate, blockCustomer);

router.get('/products/',  authenticate, products);
router.get('/products/:status',  authenticate, products);

router.get('/session/add-product',  authenticate, addProductTemplate);
router.post('/add-product',  authenticate, upload.array('images', 6), addProduct);
router.put('/delete-product',  authenticate, deleteProduct);
router.get('/session/edit-product/:id',  authenticate, editProductTemplate);
router.put('/edit-product',  authenticate, upload.array('images', 6), editProduct);

router.get('/category',  authenticate, category);
router.get('/session/add-category', authenticate, addCategoryTemplate);
router.post('/add-category', authenticate, upload.array('images', 3), addCategory);
router.put('/delete-category', authenticate, deleteCategory);
router.get('/session/edit-category/:id', editCategoryTemplate);
router.put('/edit-category', authenticate, upload.array('images', 3), editCategory);

router.get('/instagram-banner', authenticate, instagramBanner);
router.get('/gendered-banner', authenticate, genderedBanner);
router.get('/main-banner', authenticate, mainBanner);
router.post('/add-new-banner', authenticate, upload.single('image'), addNewBanner);
router.put('/edit-banner', authenticate, upload.single('image'), editbanner);
router.delete('/delete-banner/:bannerId', authenticate, deleteBanner);

router.get('/orders', adminAuthenticate, orders);

router.get('/coupons', adminAuthenticate, coupon);
router.get('/session/add-coupon', adminAuthenticate, addCouponTemplate);
router.post('/add-coupon', adminAuthenticate, addCoupon);
router.get('/session/edit-coupon/:couponId', adminAuthenticate, editCouponTemplate);
router.put('/edit-coupon', adminAuthenticate, editCoupon);
router.put('/deactivate-coupon', adminAuthenticate, deactivateCoupon);



// const Tester = require('../model/order');
// router.get('/tester', async (req, res) => {
//     const tester = await Tester.find();
//     for (const x of tester) {
//         await x.save();
//     }
// });


module.exports = router;