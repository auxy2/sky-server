const trns = require("../../../models/TransactoinsModel");
const Users = require("../../../models/userModel");
const AppError = require("../../../routes/utills/AppError");
const catchAsync = require("../../../routes/utills/catchAsync");

const toString = async (obj) => {
  for (const user of obj) {
    const createdAt = user.createdAt.toISOString();
    await Users.updateMany(
      { _id: user._id },
      {
        $set: { createdAt: createdAt },
      }
    );
  }
};

const toDate = async (obj) => {
  const getUsersByDate = await obj.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ]);

  const result = getUsersByDate.map((el) => {
    const date = el._id.date;
    const count = el.count;

    return { date, count };
  });

  return result;
};

exports.getUsersAnalysis = catchAsync(async (req, res, next) => {
  const user = await Users.findOne(req.user).select("role");
  const users = await Users.find({});

  toString(users);

  if ((user && user.role === "admin") || "maneger") {
    const result = await toDate(Users);
    console.log(result);

    res.status(200).json({
      status: "success",
      result,
    });
  } else {
    return next(new AppError("You Dont Have Access To Use This Page"));
  }
});
