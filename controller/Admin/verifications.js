const catchAsync = require("../../routes/utills/catchAsync");
const { Server, cll } = require("../../modules/webSocket");

// agregateObj[
//     {
//         $lookUp:{
//             from: 'anotherCollection',
//             localField: ''
//         }
//     }
// ]

exports.verify = catchAsync(async (req, res, next) => {
  const admin = Admin.find({ verification }).populate({
    path: "userId",
    select: "name, photo",
  });

  Server.on("connection", (ws) => {
    ws.send(JSON.stringify(admin));
    ws.on("message", (event) => {
      if (event === "view") {
        ws.send(`full verification satus: ${JSON.stringify(admin)}`);
      }
    });
  });
});
