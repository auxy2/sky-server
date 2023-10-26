const user = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");

exports.getRateAlarts = catchAsync(async (req, res, next) => {
  const alarts = await user.find();
  const groupedData = alarts.map((item) => {
    const groupedItem = {
      name: item.name,
      phoneNumber: item.phoneNumber,
      email: item.email,
      username: item.username,
      rateAlarts: [],
    };

    if (item.rateAlart) {
      groupedItem.rateAlarts = item.rateAlart.map((rateAlert) => ({
        asset: rateAlert.asset,
        enteredAmount: rateAlert.enteredAmount,
        selectedCategory: rateAlert.selectedCategory,
        selectedNotifyMethod: rateAlert.selectedNotifyMethod,
        selectedRate: rateAlert.selectedRate,
        selectedSubCategory: rateAlert.selectedSubCategory,
        createdAt: rateAlert.createdAt,
      }));
    }

    return groupedItem;
  });

  res.status(200).json({
    status: "success",
    groupedData,
  });
});

/// 08128921525; ///////
