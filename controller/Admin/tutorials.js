const catchAsync = require("../../routes/utills/catchAsync");
const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.Uploads = catchAsync(async (req, res, next) => {
  if (!fs.existsSync(req.file)) {
    console.log(req.file);
    return next(new AppError("no path found", 200));
  }
  if (req.file) {
    const videoBuffer = req.files.video[0].buffer;
    const ImageBufer = req.files.image[0].buffer;
    console.log("image", ImageBufer, "video", videoBuffer);

    cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "video" },
      async (err, ImageResult) => {
        if (err) {
          console.log(err.message);
          return next(new AppError("Error Uploading video", 200));
        }

        // cloudinary.uploader
        //   .upload_stream(
        //     req.file.path,
        //     { resource_type: "video" },
        //     async (err, VideoResult) => {
        //       if (err) {
        //         console.log(err.message);
        //         return next(new AppError("Error Uploading video", 200));
        // }

        const rate = await Rates.findOne({ Admin: "Admin" });

        const body = req.body;
        body.coverImage = ImageResult.url;
        body.video = ImageResult.url;
        body.console.log("body request", req.body, body, "image", ImageResult);

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
