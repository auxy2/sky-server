const catchAsync = require("../../routes/utills/catchAsync");
const cloudinary = require("cloudinary").v2;

exports.Uploads = catchAsync(async (req, res, next) => {
  multer({ storage }).single("video");
  res.send(200).json({
    status: "success",
    message: "Video Uploads succesfull",
  });
});
