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
            if (await Banner.findOne({bannerType: req.body.bannerType, categoryName: req.body.categoryName, _id: {$ne: req.body.bannerId}})) {
                return res.status(400).json({error: "Banner already exist in this category"});
            }
        }

        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path);
            formData.image = uploadedImage.secure_url;
        }

        const updated = await Banner.updateOne({_id: req.body.bannerId}, formData);
        
        if (updated) {
            res.status(200).json({message: "Banner edited"});
        } else {
            throw new Error("Couldn't edit banner");
        }
    } catch(err) {
        res.status(500).json({error: err.message || err});
    }
}