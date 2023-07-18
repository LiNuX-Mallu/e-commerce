const multer = require('multer');
const Product = require('../../model/product');
const Category = require('../../model/category');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const validate = require('./productValidate');

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
    console.log(req.body);
    const valid = await validate(req.body, req.files);
    if (!valid.isValid) {
        return res.status(400).json({errors: valid.errors});
    }

    try {
        const category = await Category.findOne({categoryName: req.body.category});
        if (category) {
            req.body.category = {
                categoryName: category.categoryName,
                categoryId: category._id
            };
        } else {
            throw new Error("couldn't fill category");
        }

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
        const newProduct = new Product(req.body);
        imageUrls.map(url => {
            newProduct.images.push(url);
        });
        
        const saved = await newProduct.save();
        
        if (saved) {
            res.status(200).json({message:"Product added successfully"});
        } else {
            throw new Error("couldn't add new product");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: err.message || "Internal server errror"});
    }
}