const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_Key,
  api_secret: process.env.cloudinary_api_secret,
});

module.exports = cloudinary;
