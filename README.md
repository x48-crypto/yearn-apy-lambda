# Yearn APY lambda function

## Demo
https://qxy484i2o3.execute-api.us-east-1.amazonaws.com/

## Installation and usage
- Clone repository and run `npm install`
- Add API keys for archivenode and infura to `config.js`
- Zip repository contents (including node_modules)
- Create AWS Lambda function
- Create DynamoDB table named "vaultApy"
- Make sure lambda function execution role has access to dynamo table
- Uploads zip file to AWS lambda function
- Hit test on AWS Lambda page and make sure dynamo table is populated
- Set up a cron job in AWS to run the script periodically

## Example response payload
```
[{
  "apyOneDaySample": 85.27717473106867,
  "apyThreeDaySample": 78.61880326461744,
  "symbol": "yCRV",
  "timestamp": 1599074544378,
  "apyInceptionSample": 89.60708024930906,
  "address": "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c",
  "description": "yDAI/yUSDC/yUSDT/yTUSD",
  "name": "curve.fi/y LP",
  "vaultSymbol": "yUSD"
}, {
  "apyOneDaySample": 11.989284929478655,
  "apyThreeDaySample": 13.828023404468395,
  "symbol": "USDC",
  "timestamp": 1599074556284,
  "apyInceptionSample": 22.786380953605395,
  "address": "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e",
  "description": "USD//C",
  "name": "USD Coin",
  "vaultSymbol": "yUSDC"
}, {
  "apyOneDaySample": 84.03206649901006,
  "apyThreeDaySample": 0,
  "symbol": "WETH",
  "timestamp": 1599074539596,
  "apyInceptionSample": 85.24555658236235,
  "address": "0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7",
  "description": "Wrappeth Ether",
  "name": "WETH",
  "vaultSymbol": "yWETH"
}, {
  "apyOneDaySample": 59.74776043590106,
  "apyThreeDaySample": 40.07804989612266,
  "symbol": "crvBUSD",
  "timestamp": 1599074546628,
  "apyInceptionSample": 42.1155421513349,
  "address": "0x2994529c0652d127b7842094103715ec5299bbed",
  "description": "yDAI/yUSDC/yUSDT/yBUSD",
  "name": "curve.fi/busd LP",
  "vaultSymbol": "ycrvBUSD"
}, {
  "apyOneDaySample": 63.378920742830786,
  "apyThreeDaySample": 57.38829961091271,
  "symbol": "crvBTC",
  "timestamp": 1599074548985,
  "apyInceptionSample": 49.115033329575276,
  "address": "0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6",
  "description": "renBTC/wBTC/sBTC",
  "name": "curve.fi/sbtc LP",
  "vaultSymbol": "ycrvBTC"
}, {
  "apyOneDaySample": 42.941118368941055,
  "apyThreeDaySample": 43.77346739629583,
  "symbol": "USDT",
  "timestamp": 1599074558652,
  "apyInceptionSample": 35.74808356019418,
  "address": "0x2f08119C6f07c006695E079AAFc638b8789FAf18",
  "description": "Tether USD",
  "name": "USDT",
  "vaultSymbol": "yUSDT"
}, {
  "apyOneDaySample": 82.14636949326938,
  "apyThreeDaySample": 74.49797211019465,
  "symbol": "TUSD",
  "timestamp": 1599074554014,
  "apyInceptionSample": 30.934959349376076,
  "address": "0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a",
  "description": "TrueUSD",
  "name": "TUSD",
  "vaultSymbol": "yTUSD"
}, {
  "apyOneDaySample": 1.5282227708527358,
  "apyThreeDaySample": 1.5775588208142508,
  "symbol": "LINK",
  "timestamp": 1599074563229,
  "apyInceptionSample": 8.674250295814623,
  "address": "0x881b06da56BB5675c54E4Ed311c21E54C5025298",
  "description": "ChainLink",
  "name": "ChainLink",
  "vaultSymbol": "yLINK"
}, {
  "apyOneDaySample": 359.3518125338231,
  "apyThreeDaySample": 283.8924679939649,
  "symbol": "DAI",
  "timestamp": 1599074551385,
  "apyInceptionSample": 79.63323808903331,
  "address": "0xACd43E627e64355f1861cEC6d3a6688B31a6F952",
  "description": "DAI Stablecoin",
  "name": "DAI",
  "vaultSymbol": "yDAI"
}, {
  "apyOneDaySample": 6.578562684999233,
  "apyThreeDaySample": 3.2909697733497594,
  "symbol": "aLINK",
  "timestamp": 1599074560910,
  "apyInceptionSample": 45.50684740721052,
  "address": "0x29E240CFD7946BA20895a7a02eDb25C210f9f324",
  "description": "Aave Interest bearing LINK",
  "name": "aLINK",
  "vaultSymbol": "yaLINK"
}, {
  "apyOneDaySample": 0,
  "apyThreeDaySample": 0,
  "symbol": "YFI",
  "timestamp": 1599074542027,
  "apyInceptionSample": 4.051782106328094,
  "address": "0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1",
  "description": "yearn.finance",
  "name": "yearn.finance",
  "vaultSymbol": "yYFI"
}]
```