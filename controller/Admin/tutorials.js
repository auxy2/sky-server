const catchAsync = require("../../routes/utills/catchAsync");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../../Tutorials");
  },
  filename: (req, file, callback) => {
    const ext = file.originalname.split(".").pop();
  },
});

exports.Uploads = catchAsync(async (req, res, next) => {
  multer({ storage }).single("video");
  res.send(200).json({
    status: "success",
    message: "Video Uploads succesfull",
  });
});
