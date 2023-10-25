const catchAsync = require("../../routes/utills/catchAsync");
const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const cloudinary = require("cloudinary").v2;

exports.Uploads = catchAsync(async (req, res, next) => {
  if (req.file) {
    cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "video" },
      async (err, result) => {
        if (err) {
          console.log(err.message);
          return next(new AppError("Error Uploading video", 200));
        }

        const rate = await Rates.findOne({ Admin: "Admin" });

        const body = req.body;
        body.url = result.url;
        console.log(req.body, body);
        const newtutorials = [...rate.tutorials, body];
        rate.tutorials = newtutorials;
        res.status(200).json({
          status: "success",
          message: "Video Uploads succesfull",
        });
      }
    );
  } else {
    return next(new AppError("no video found", 200));
  }
});
