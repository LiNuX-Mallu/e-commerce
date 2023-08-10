const User = require('../../../model/user');
const Banner = require('../../../model/banner');
const Category = require('../../../model/category');
const Product = require('../../../model/product');

module.exports = async (req, res) => {
    let mainBanner, instagramBanner, menBanner, womenBanner;
    let menCategory, womenCategory, kidsCategory;
    let menProduct, womenProduct;

    try {
        mainBanner = await Banner.find({bannerType: "mainBanner"});
        instagramBanner = await Banner.find({bannerType: "instagramBanner"});
        menBanner = await Banner.findOne({bannerType: "genderedBanner", categoryName: "men"});
        womenBanner = await Banner.findOne({bannerType: "genderedBanner", categoryName: "women"});

        menCategory = await Category.findOne({categoryName: "men"});
        womenCategory = await Category.findOne({categoryName: "women"});
        kidsCategory = await Category.findOne({categoryName: "kids"});

        menProduct = await Product.find({"category.categoryName": "men", notAvailable: false}).populate('category.categoryId', 'offer');
        womenProduct = await Product.find({"category.categoryName": "women", notAvailable: false}).populate('category.categoryId', 'offer');


        if (!mainBanner || !instagramBanner || !menBanner || !womenBanner || !menCategory || !womenCategory || !kidsCategory || !menProduct || !womenProduct) {
            throw new Error("Internal server error");
        }
    } catch(err) {
        return res.status(500).send(err.message || "Internal server error");
    }

    if (req.session && req.session.userLoggedIn) {
        try {
            const user = await User.findById(req.session.userId).populate({path: 'cart'}).populate({path: 'cart.productId', model: 'Product'});
            if (user) {
                res.render('user/home', {user, mainBanner, instagramBanner, menBanner, womenBanner, womenCategory, menCategory, kidsCategory, menProduct, womenProduct});
            } else {
                delete req.session.userLoggedIn;
                delete req.session.userId;
                res.render('user/home', {user: false, mainBanner, instagramBanner, menBanner, womenBanner, womenCategory, menCategory, kidsCategory, menProduct, womenProduct});
            }
        } catch(err) {
            res.status(500).send("Internal server error");
        }
    } else {
        res.render('user/home', {user: false, mainBanner, instagramBanner, menBanner, womenBanner, womenCategory, menCategory, kidsCategory, menProduct, womenProduct});
    }   
};