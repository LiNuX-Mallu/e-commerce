const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerType: {type: String, required: true},
    image: {type: String, required: true},
    title: {type: String},
    categoryName: {type: String},
    description: {type: String},
    linkTo: {type: String},
    offer: {type: Number}
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;