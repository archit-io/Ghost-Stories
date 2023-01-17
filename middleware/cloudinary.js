const cloudinary = require("cloudinary").v2;
console.log("Cloudinary connected.")
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;