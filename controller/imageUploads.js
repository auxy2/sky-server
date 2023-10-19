const axios = require("axios");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_Key,
  api_secret: process.env.cloudinary_api_secret,
});

const UploadsImage = (imageUri) => {
  cloudinary.uploader.upload(imageUri, (err, result) => {
    if (err) {
      res.send("Error Uploading Image");
    } else {
      console.log(result);
      return result;
    }
  });
};

module.exports = {
  UploadsImage,
};
