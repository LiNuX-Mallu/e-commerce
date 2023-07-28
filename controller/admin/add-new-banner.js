const Banner = require('../../model/banner');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

const {CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET} = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_API_KEY, 
    api_secret: CLOUD_API_SECRET 
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

const upload = multer({storage: storage});

module.exports = async (req, res) => {
    const formData = req.body;
    try {
        if (req.body.bannerType === "genderedBanner") {
            if (await Banner.findOne({bannerType: req.body.bannerType, categoryName: req.body.categoryName})) {
                return res.status(400).json({error: "Banner already exist in this category"});
            }
        }

        const uploadedImage = await cloudinary.uploader.upload(req.file.path);
        formData.image = uploadedImage.secure_url;
        const newBanner = new Banner(req.body);
        const saved = await newBanner.save();
        if (saved) {
            res.status(200).json({message: "New banner added"});
        } else {
            throw new Error("Couldn't add new banner");
        }
    } catch(err) {
        res.status(500).json({error: err.message || err});
    }
}