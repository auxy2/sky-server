const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const trns = require("./TransactoinsModel");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [8, "Name must be grater 8 characters"],
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      unique: [true, "there is a user with the username"],
      required: [true, "username is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password must be greater than 8 character"],
      select: false,
    },
    passConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Pasword does not match",
      },
    },
    token: {
      type: String,
    },
    giftCardRate: String,
    ethRate: String,
    usdtRate: String,
    BtcRate: String,
    verify: {
      type: String,
    },
    progress: {
      type: String,
      enum: ["40%", "55%", "70%", "85%", "100%"],
      default: "40%",
    },
    profilePhoto: {
      type: String,
      default: "null",
    },
    phoneNumber: {
      type: String,
      required: [true, "please inpute your phone number"],
      minlength: [11, "mobile Number is too short"],
      maxlength: [11, "mobile Number is too long"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "maneger", "customer_service"],
      default: "user",
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowerCase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    walletBalance: {
      type: String,
      default: "0.00",
    },
    usdtWalletAddress: {
      type: String,
    },
    usdtKeyWallet: {
      type: String,
      select: false,
    },
    EtherWallet: {
      type: String,
    },
    Etherkey: {
      type: String,
      select: false,
    },
    my_device: String,
    BtcBalance: {
      type: Number,
    },
    transactionPin: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    btckey: {
      type: String,
      select: false,
    },
    TWO_FA: {
      type: String,
    },

    btcWalletAddress: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    verifyId: {
      type: Boolean,
      default: false,
    },
    passworadEpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    ref_Link_Code: {
      type: String,
      timeStamp: {
        type: Date,
        default: Date.now(),
      },
    },
    activity: {
      type: Boolean,
      default: true,
    },
    devices: [],
    accounName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    rateAlart: [
      {
        asset: String,
        enteredAmount: String,
        selectedCategory: String,
        selectedNotifyMethod: String,
        selectedRate: String,
        selectedSubCategory: String,
        email: String,
        username: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    trxHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "TRXs",
      },
    ],
    bankCode: {
      type: String,
    },
    giftcardHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Gift_Card",
      },
    ],
    bankName: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// UserSchema.virtual('gift_Cards',{
//     ref: 'Gift_Card',
//     foreignField: 'User',
//     localField: '_id'
// });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passConfirm = undefined;
  next();
});
// UserSchema.pre('save', async function(next){
//  const manegements = await this.manements.map(async id  => await User.findById(id));
//  this.manements = Promise.all(manegements);
//  next()
// })
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew)
    this.passwordChangedAt = Date.now();
  next();
});

// UserSchema.pre('save', async function(next) {
//     if(this.cryptoTxHistory.isModified){
//         this.cryptoTxHistory.forEach(el => {
//             if(el === this.cryptoTxHistory){
//                this.cryptoTxHistory[el] = this.GiftCardHistory[el]
//             }
//         })
//     }
// })

UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// UserSchema.pre('save', async function(next){
//     if(!this.isModified('BtcBalance'))
//     this.BtcBalance =  this.BtcBalance + 10**8;

//     next()
// })
UserSchema.methods.notifyUserIfAmountBelowRate = function (alart) {
  const enteredAmount = parseFloat(alart.enteredAmount);
  const selectedRate = parseFloat(alart.selectedRate);
  if (enteredAmount < selectedRate) {
    return `Gift Card Rate is bellow ${selectedRate} `;
  }
  return false;
};

UserSchema.methods.correctPass = async function (Candidiatepass, userPass) {
  return bcrypt.compare(Candidiatepass, userPass);
};

UserSchema.methods.createTx = async function (obj) {
  await trns.create(obj);
};
UserSchema.methods.changePassAfter = function (JWT_TIME_STMP) {
  if (this.passwordChangedAt) {
    const changeTimeStanp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changeTimeStanp);
    return JWT_TIME_STMP < changeTimeStanp;
  }
  return false;
};

////// Create password reset token only for user's thats unablr to login //////
UserSchema.methods.creteToken = function () {
  //  create Randon token
  const token = crypto.randomBytes(32).toString("hex");

  return token;
};

const skyshowng = mongoose.model("Users", UserSchema);

module.exports = skyshowng;
