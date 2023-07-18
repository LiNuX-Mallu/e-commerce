const Category = require('../../model/category');

module.exports = async (data, files) => {
    const errors = {};

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!data.productName || !nameRegex.test(data.productName)) {
        errors.nameError = "please provide a valid name";
    }

    if (data.description.length < 1) {
        errors.descriptionError = "description must have atleast 100 characters";
    }

    if (!data.category || !nameRegex.test(data.category)) {
        errors.categoryError = "please provide a valid category name";  
    } else if (!await Category.findOne({categoryName: data.category})) {
        errors.categoryError = "category does not exist";
    }

    if (isNaN(+data.price) || !data.price) {
        errors.priceError = "please provide a valid price"
    }

    Object.keys(data.sizeAndStock).forEach((size) => {
        if (isNaN(+data.sizeAndStock[size]) || !data.sizeAndStock[size]) {
            errors.sizeError = "Enter a valid quantity";
        }
    });

    if (data.selectedImages && files) {
        if (Array.isArray(data.selectedImages)) {
            if (data.selectedImages.length + files.length < 1) {
                errors.fileError = "please select atleast 6 images";
            }
        } else {
            if (files.length < 0) {
                errors.fileError = "please select atleast 6 images"
            }
        }
    } else if (!data.selectedImages && files) {
        if (files.length < 1) {
            errors.fileError = "please select atleast 6 images";
        }
    }

    if (!data.selectedImages && !files) {
        errors.fileError = "please add some images";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}