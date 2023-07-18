const multer = require('multer');
const Category = require('../../model/category');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const validate = require('./categoryValidate');

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

    const formData = req.body;
    const categoryId = req.body.categoryId;
    try {
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
        
        const updated = await Category.updateOne({_id: categoryId}, formData);
        
        if (updated.acknowledged && updated.modifiedCount !== 0) {
            res.status(200).json({message: "Category edited successfully"});
        } else if (updated.acknowledged && updated.modifiedCount === 0) {
            res.status(401).json({error: "Nothing to update"});
        } else {
            throw new Error("couldn't edit category details");
        }

    } catch(err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}