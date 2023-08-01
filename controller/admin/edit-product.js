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
    const valid = await validate(req.body, req.files);
    if (!valid.isValid) {
        return res.status(400).json({errors: valid.errors});
    }

    const formData = req.body;
    const productId = req.body.productId;
    try {
        const category = await Category.findOne({categoryName: req.body.category});
        if (category) {
            formData.category = {
                categoryName: category.categoryName,
                categoryId: category._id
            };
        } else {
            throw new Error("couldn't fill category");
        }

        formData.images = [];
        if (Array.isArray(req.body.selectedImages)) {
            req.body.selectedImages.forEach(url => {
                formData.images.push(url);
            });
        } else {
            if (req.body.selectedImages) {
                formData.images.push(req.body.selectedImages);
            }
        }
        delete formData.selectedImages;

        const images = req.files.map(file => file.path);

        const uploadedImages = await Promise.all(
            images.map(image => cloudinary.uploader.upload(image))
        );

        const imageUrls = uploadedImages.map(image => image.secure_url);

        imageUrls.map(url => {
            formData.images.push(url);
        });
        
        const updated = await Product.updateOne({_id: productId}, {$set: formData});
        
        if (updated.acknowledged && updated.modifiedCount !== 0) {
            res.status(200).json({message: "Product edited successfully"});
        } else if (updated.acknowledged && updated.modifiedCount === 0) {
            res.status(401).json({error: "Nothing to update"});
        } else {
            throw new Error("couldn't edit product details");
        }

    } catch(err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}