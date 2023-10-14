// const User = require(".././models/userModel");
// const axios = require("axios");
// const { getCryptocurencyRate } = require("../APIs");
// const AppError = require("../routes/utills/AppError");
// const catchAsync = require("../routes/utills/catchAsync");

// wss.on("connection", (ws) => {
//   console.log("Client connected successfully");

//   ws.on("message", (meessege) => {
//     console.log(`Received: ${meessege}`);
//     ws.send(`You sent this? ${meessege}`);
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });

//   setTimeout(() => {
//     ws.on("message", (messeges) => {
//       if (messeges === "yes") {
//         console.log("ok good");
//       }
//       ws.send("ok good");
//     });
//   }, 5000);
// });

// exports.rateAlart = catchAsync(async (req, res, next) => {
//   const { amount, currency } = req.body;

//   let type;
//   setInterval(async function () {
//     const response = await axios.get(
//       getCryptocurencyRate + `?ids=${currency}&vs_currencies=usd`
//     );
//     const price = response.data.bitcoin.usd;

//     const notifier = {
//       title: `Crypto Rate Alart: ${currency}`,
//     };
//     if (price > amount) {
//       type = "Below";
//       console.log(`Curent price of ${currency}: $${price}`);
//       notifier.message = `1: price is ${type} the Threshold Of $${amount}. Current price: $${price.toLocaleString()}`;

//       res.status(200).json({
//         status: "sucess",
//         data: {
//           notifier,
//         },
//       });
//     } else if (price < amount) {
//       type = "Above";
//       console.log(`Curent price of ${currency}: $${price}`);
//       notifier.message = `2: price is ${type} the Threshold Of $${amount}. Current price: $${price.toLocaleString()}`;

//       res.status(200).json({
//         status: "sucess",
//         data: {
//           notifier,
//         },
//       });
//     }
//   }, 5000);
// });
