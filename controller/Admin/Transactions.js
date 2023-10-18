const trns = require("../../models/TransactoinsModel");
const giftCard = require("../../models/GiftcardModel");
const catchAsync = require("../../routes/utills/catchAsync");

exports.viewAllTrns = catchAsync(async (req, res, next) => {
  const trnx = await trns.find().populate({
    path: "userId",
    select: "name email phoneNumber",
  });
  // const gift_card = await giftCard.find().populate({
  //     path: 'userId',
  //     selct: "name"
  // })
  res.status(200).json({
    status: "sucess",
    trnx,
  });
});

exports.userTransation = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const userTransation = await trns.find({ userId: req.query.id }).populate({
    path: "userId",
    select:
      "name email phoneNumber walletBalance accounName accountNumber bankName rateAlart",
  });

  // const rateAlart = userTransation.map((item) => {
  //   return {
  //     asset: item.userId[0].rateAlart[0].asset,
  //     enteredAmount: item.userId[0].rateAlart[0].enteredAmount,
  //     selectedCategory: item.userId[0].rateAlart[0].selectedCategory,
  //     selectedNotifyMethod: item.userId[0].rateAlart[0].selectedNotifyMethod,
  //     selectedRate: item.userId[0].rateAlart[0].selectedRate,
  //     selectedSubCategory: item.userId[0].rateAlart[0].selectedSubCategory,
  //     createdAt: item.userId[0].rateAlart[0].createdAt,
  //     _id: item.userId[0].rateAlart[0]._id,
  //     id: item.userId[0].rateAlart[0]._id,
  //   };
  // });

  // const bankdetails = userTransation.map((item) => {
  //   return {
  //     accounName: item.userId[0].accounName,
  //     accountNumber: item.userId[0].accountNumber,
  //     bankName: item.userId[0].bankName,
  //     walletBalance: item.userId[0].walletBalance,
  //   };
  // });

  // Create the 'allTransactions' array
  // const allTransactions = userTransation.map((item) => {
  //   return {
  //     amount: item[0].amount,
  //   };
  // });

  for (const entry of userTransation) {
    const rateAlart = entry.userId[0].rateAlart;
    const userData = entry.userId[0];
    const {
      name,
      email,
      phoneNumber,
      accounName,
      accountNumber,
      bankName,
      walletBalance,
    } = userData;

    const bankdetails = {
      accounName,
      accountNumber,
      bankName,
      walletBalance,
    };
    // const transactions = {
    //   userId: [
    //     {
    //       name,
    //       email,
    //       phoneNumber,
    //     },
    //   ],
    //   amount: entry.amount,
    //   currency: entry.currency,
    //   createdAt: entry.createdAt,
    //   status: entry.status,
    //   access_code: entry.access_code,
    //   txId: entry.txId,
    //   id: entry.id,
    // };

    res.status(200).json({
      status: "success",
      rateAlart,
      bankdetails,
      userTransation,
    });
  }
});
