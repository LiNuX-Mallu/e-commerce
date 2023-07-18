const Category = require('../../model/category');

module.exports = async (data, files) => {
    const errors = {};

    const nameRegex = /^[a-zA-Z\s]+$/;
    const category = await Category.findById(data.categoryId);
    if (data.categoryId && category.categoryName !== data.categoryName) {
        if (!data.categoryName || !nameRegex.test(data.categoryName)) {
            errors.nameError = "please provide a valid name";
        } else if (await Category.findOne({categoryName: data.categoryName})) {
            errors.nameError = "category name already exist";
        }
    } else if (!data.categoryId) {
        if (!data.categoryName || !nameRegex.test(data.categoryName)) {
            errors.nameError = "please provide a valid name";
        } else if (await Category.findOne({categoryName: data.categoryName})) {
            errors.nameError = "category name already exist";
        }
    }

    if (data.description.length < 1) {
        errors.descriptionError = "description must have atleast 100 characters";
    }

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