const catchAsync = require("../../routes/utills/catchAsync");
const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.Uploads = catchAsync(async (req, res, next) => {
  if (!fs.existsSync(req.file.path)) {
    return next(new AppError("no path found", 200));
  }
  if (req.file) {
    const videoBuffer = req.file.video[0].buffer;
    const ImageBufer = req.file.image[0].buffer;
    console.log("image", ImageBufer, "video", videoBuffer);

    cloudinary.uploader
      .upload_stream(
        req.file.path,
        { resource_type: "image" },
        async (err, ImageResult) => {
          if (err) {
            console.log(err.message);
            return next(new AppError("Error Uploading video", 200));
          }

          cloudinary.uploader
            .upload_stream(
              req.file.path,
              { resource_type: "video" },
              async (err, VideoResult) => {
                if (err) {
                  console.log(err.message);
                  return next(new AppError("Error Uploading video", 200));
                }

                const rate = await Rates.findOne({ Admin: "Admin" });

                const body = req.body;
                body.coverImage = ImageResult.url;
                body.video = VideoResult.url;
                body.console.log(
                  "body request",
                  req.body,
                  body,
                  "image",
                  ImageResult,
                  "video",
                  VideoResult
                );

                const newtutorials = [...rate.tutorials, body];
                rate.tutorials = newtutorials;
                res.status(200).json({
                  status: "success",
                  message: "Video Uploads succesfull",
                });
              }
            )
            .end(videoBuffer);
        }
      )
      .end(ImageBufer);
  } else {
    return next(new AppError("no video found", 200));
  }
});
