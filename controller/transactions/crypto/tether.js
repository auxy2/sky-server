const User = require("../../../modules/usermodule");
const AppError = require("../../../routs/util/AppError");
const ethers = require("ethers");
const catchAsync = require("../../../routs/util/asynCatch");
// const Admin = require('../../Admin')
const ABI = require("../../../modules/build/modules_ConbinedContracts_sol_USDTTransfer.abi");

// const deployer = async(prvKey) => {

//     const provider = new ethers.getDefaultProvider('mainnet');
//     const wallet = new ethers.Wallet(prvKey, provider);
//     try{
//     const contractFactory = new ethers.ContractFactory(abi, bin, wallet)
//     const contract = await contractFactory.deploy(wallet);
//     await contract.deployed();

//     return contract.address;

//     }catch(err){
//         return next(new AppError(err.message, 403))
//     }

// }

exports.generateTetherAddress = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  console.log("1", user);

  if (!user) {
    return next(new AppError("please loging to use this page", 403));
  }
  console.log("2", user);
  // const constractAddress = await deployer();

  // user.usdtWalletAddress = constractAddress
  // await user.save({validateBeforeSave: false});

  // const checkAndSendUsdt = async() => {

  //     const admin = await Admin.findOne( { role: 'admin'});

  //     const Key = admin.etherKey;
  //     const provider = new ethers.getDefaultProvider('mainnet');
  //     const signer = new ethers.Wallet(Key, provider);

  //     const contract = new ethers.Contract(user.usdtWalletAddress, ABI, signer);
  //     const usdtBalance = await contract.getBalance();

  //     if(usdtBalance.gt(0)){

  //         const tx = await contract.transfer(admin.usdtWalletAddress, usdtBalance);
  //         await tx.await();

  //         console.log(`sent ${ethers.ustils.parseUnits(usdtBalance, 6)}`);
  //         console.log(tx.hash)
  //         const newTx = {
  //             userId: user._id,
  //             txId: tx.hash,
  //             status: 'success',
  //             amount: balance,
  //             currency: 'Usdt'
  //         }
  //         await user.creatTx(newTx)
  //     }

  res.status(200).json({
    status: "success",
    UsdtAddress: "0x12kj1b24or4r42buf2442",
  });
});