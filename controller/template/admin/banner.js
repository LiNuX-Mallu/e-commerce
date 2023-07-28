const Banner = require('../../../model/banner');

const mainBanner = async (req, res) => {
    try {
        const banner = await Banner.find({bannerType: "mainBanner"});
        if (banner) {
            res.render('admin/banners/main', {banners: banner});
        } else {
            throw new Error("Internal server error");
        }
    } catch(err) {
        res.status(500).send(err.message || "Internal server error");
    }
}

const instagramBanner = async (req, res) => {
    try {
        const banner = await Banner.find({bannerType: "instagramBanner"});
        if (banner) {
            res.render('admin/banners/instagram', {banners: banner});
        } else {
            throw new Error("Internal server error");
        }
    } catch(err) {
        res.status(500).send(err.message || "Internal server error");
    }
}

const genderedBanner = async (req, res) => {
    try {
        const banner = await Banner.find({bannerType: "genderedBanner"});
        if (banner) {
            res.render('admin/banners/gendered', {banners: banner});
        } else {
            throw new Error("Internal server error");
        }
    } catch(err) {
        res.status(500).send(err.message || "Internal server error");
    }
}


module.exports = {mainBanner, instagramBanner, genderedBanner};