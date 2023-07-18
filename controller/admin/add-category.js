const multer = require('multer');
const Category = require('../../model/category');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const validate = require('./categoryValidate');
const category = require('../template/admin/category');

const {CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET} = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME, 
    api_key: CLOUD_API_KEY, 
    api_secret: CLOUD_API_SECRET 
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'categories',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

const upload = multer({storage: storage});

module.exports = async (req, res) => {
    const valid = await validate(req.body, req.files);
    if (!valid.isValid) {
        return res.status(400).json({errors: valid.errors});
    }

    try {
        const images = req.files.map(file => file.path);

        const uploadedImages = await Promise.all(
            images.map(image => cloudinary.uploader.upload(image))
        );

        if (!uploadedImages[0]) {
            throw new Error("couldn't upload images");
        }

        const imageUrls = uploadedImages.map(image => image.secure_url);

        const date = new Date(Date.now());

        const day = date.toLocaleString('en-US', { weekday: 'short' });
        const dateNumber = date.getDate();
        const month = date.getMonth()-1;
        const year = date.getFullYear();

        const filteredDate = `${day} ${dateNumber}-${month}-${year}`;

        req.body.addedAt = filteredDate;
        const newCategory = new Category(req.body);
        imageUrls.map(url => {
            newCategory.images.push(url);
        });
        
        const saved = await newCategory.save();
        
        if (saved) {
            res.status(200).json({message:"Category created successfully"});
        } else {
            throw new Error("couldn't create new category");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}