// const axios = require('axios');
// const asyncCatch = require('./routs/util/asynCatch');


Apis = {

    baseUrl: 'api/V1/skyshowNG', // Base Url not including webhooks or alarts

    //   crypto currency //
    
    broadcastUrl: 'https://api.blockcypher.com/v1/btc/main/txs/push',
     unspent: 'https://blockchain.info/unspent?active=',
     Info: 'https://api.blockcypher.com/v1/btc/main/addrs/',     
     EthreumNode: 'https://eth-mainnet.ws.alchemyapi.io/v2/',
     TetherContract: 'https://eth-mainnet.alchemyapi.io/v2/',
     getCryptocurencyRate: 'https://api.coingecko.com/api/v3/simple/price',
     ngnRate: `https://api.coingecko.com/api/v3/coins/bitcoin`,
     status: 'https://blockstream.info/api/tx/',

     //   payments  //
     
    getBankCode: 'https://api.paystack.co/bank',
    transferRecipient: 'https://api.paystack.co/transferrecipient',
    transfer:'https://api.paystack.co/transfer',
}


module.exports = Apis