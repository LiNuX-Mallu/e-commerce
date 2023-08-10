const Product = require('../../../model/product');
const User = require('../../../model/user');

module.exports = async (req, res) => {
    let result, category, size, sort, keyword;
    let sortOption = {};
    const query = {notAvailable: false};

    let page;
    if (req.query.page && req.query.page !== '') {
        page = parseInt(req.query.page);
    } else {
        page = 1;
    }
    const perPage = 3;
    const startIndex = (page - 1) * perPage;
        
    try {
        if (req.query.category && req.query.category !== 'false') {
            category = req.query.category;
            query["category.categoryName"] = category;
        } else {
            category = false;
        }

        if (req.query.size && req.query.size !== 'false') {
            size = req.query.size;
            query[`sizeAndStock.${size}`] = {$gt: 0};
        } else {
            size = false;
        }

        if (req.query.priceRange && req.query.priceRange !== 'false') {
            priceRange = req.query.priceRange;
            let priceRangeParts = priceRange.replaceAll(/₹/g, '').trim();
            priceRangeParts = priceRangeParts.split("-");
            query.price = {$gt: parseFloat(priceRangeParts[0]), $lt: parseFloat(priceRangeParts[1])};
        } else {
            priceRange = false;
        }

        if (req.query.sort && req.query.sort !== 'false') {
            sort = req.query.sort;
            if (req.query.sort === "lowToHigh") {
                sortOption.price = 1;
            } else if (req.query.sort === "highToLow") {
                sortOption.price = -1;
            }
        } else {
            sort = false;
        }

        if (req.query.keyword && req.query.keyword !== 'false') {
            keyword = req.query.keyword;
            query.productName = new RegExp(keyword, 'i');
        } else {
            keyword = false;
        }

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / perPage);
        if (page > totalPages) {
            result = [];
        } else {
            result = await Product.find(query).sort(sortOption).skip(startIndex).limit(perPage).populate('category.categoryId');
        }          

    } catch(err) {
        console.log(err);
        res.status(500).send('internal server error');
    }
    if (page === 1) {
        if (req.session && req.session.userLoggedIn) {
            if (result) {
                const user = await User.findById(req.session.userId).populate({path: 'cart'}).populate({path: 'cart.productId', model: 'Product'});
                if (user) {
                    res.render('user/shop', {products: result, user, category, noMoreData: Boolean(false), size, priceRange, sort, keyword});
                } else {
                    delete req.session.userLoggedIn;
                    delete req.session.userId;
                    res.render('user/shop', {products: result, user: false, category, noMoreData: Boolean(false), size, priceRange, sort, keyword});
                }
            } else {
                res.status(500).send('internal server error');
            }
            
        } else {
            if (result) {
                res.render('user/shop', {products: result, user: false, category, noMoreData: Boolean(false), size, priceRange, sort, keyword});
            } else {
                res.status(500).send("Internal server error");
            }
        }
    } else {
        res.status(200).json(result);
    }
};