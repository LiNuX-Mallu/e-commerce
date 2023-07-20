const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const login = require('../controller/template/admin/admin-login');
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

router.get('/customers', authenticate, viewCustomers);
router.put('/block-customer', authenticate, blockCustomer);

router.get('/products',  authenticate, products);
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


module.exports = router;