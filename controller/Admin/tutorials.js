const catchAsync = require("../../routes/utills/catchAsync");
const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.Uploads = catchAsync(async (req, res, next) => {
  if (req.file) {
    cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "video" },
      async (err, VideoResult) => {
        if (err) {
          return next(new AppError("Error Uploading video", 200));
        }

        const rate = await Rates.findOne({ Admin: "Admin" });

        const body = req.body;
        body.video = VideoResult.url;

        const newtutorials = [...rate.tutorials, body];
        rate.tutorials = newtutorials;
        await rate.save();
        const latestVideo = rate.tutorials;
        const UploadedVideo = latestVideo.find(
          (item) => item.title === body.title
        );
        res.status(200).json({
          status: "success",
          UploadedVideo,
        });
      }
    );
  } else {
    return next(new AppError("no video found", 200));
  }
});

exports.getTutorials = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" }).sort({});
  const AllTutorials = rates.tutorials;
  res.status(200).json({
    status: "success",
    AllTutorials,
  });
});

exports.deleteTutorial = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });

  const rate = rates.tutorials;
  const newTutorials = rate.filter(
    (item) => item._id.toString() !== req.query.id
  );
  rates.tutorials = newTutorials;
  await rates.save();
  res.status(200).json({
    status: "success",
    message: "you successfully deleted a tutorial video",
  });
});
