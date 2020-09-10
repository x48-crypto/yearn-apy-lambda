const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const Web3 = require("web3");
const moment = require("moment");
const delay = require("delay");
const _ = require("lodash");
const vaults = require("./vaults");
const EthDater = require("./ethereum-block-by-date.js");
const { delayTime, apiKeys } = require('./config');

const archiveNodeUrl = `https://api.archivenode.io/${apiKeys.archiveNode}`;
const infuraUrl = `https://mainnet.infura.io/v3/${apiKeys.infura}`;
const archiveNodeWeb3 = new Web3(archiveNodeUrl);
const infuraWeb3 = new Web3(infuraUrl);
const blocks = new EthDater(archiveNodeWeb3, delayTime);
const nbrBlocksInDay = 6646; // Estimate based on yearn's APY calculations

let currentBlockNbr;
let oneDayAgoBlock;
let threeDaysAgoBlock;
const oneDayAgo = moment().subtract(1, "days").valueOf();
const threeDaysAgo = moment().subtract(3, "days").valueOf();

const saveData = async (data) => {
  const params = {
    TableName: "vaultApy",
    Item: data,
  };
  await db
    .put(params)
    .promise()
    .catch((err) => console.log("err", err));
};

const getApy = async (
  previousValue,
  currentValue,
  previousBlockNbr,
  currentBlockNbr
) => {
  if (!previousValue) {
    return 0;
  }
  const pricePerFullShareDelta = (currentValue - previousValue) / 1e18;
  const blockDelta = currentBlockNbr - previousBlockNbr;
  const dailyRoi = (pricePerFullShareDelta / blockDelta) * 100 * nbrBlocksInDay;
  const yearlyRoi = dailyRoi * 365;
  return yearlyRoi;
};

const getPricePerFullShare = async (
  vaultContract,
  block,
  inceptionBlockNbr
) => {
  const contractDidntExist = block < inceptionBlockNbr;
  const inceptionBlock = block === inceptionBlockNbr;
  if (inceptionBlock) {
    return 1e18;
  }
  if (contractDidntExist) {
    return 0;
  }
  const pricePerFullShare = await vaultContract.methods
    .getPricePerFullShare()
    .call(undefined, block);
  await delay(delayTime);
  return pricePerFullShare;
};

const getApyForVault = async (vault) => {
  const {
    lastMeasurement: inceptionBlockNbr,
    vaultContractABI: abi,
    vaultContractAddress: address,
  } = vault;

  const vaultContract = new archiveNodeWeb3.eth.Contract(abi, address);

  const pricePerFullShareInception = await getPricePerFullShare(
    vaultContract,
    inceptionBlockNbr,
    inceptionBlockNbr
  );

  const pricePerFullShareCurrent = await getPricePerFullShare(
    vaultContract,
    currentBlockNbr,
    inceptionBlockNbr
  );

  const pricePerFullShareOneDayAgo = await getPricePerFullShare(
    vaultContract,
    oneDayAgoBlock,
    inceptionBlockNbr
  );

  const pricePerFullShareThreeDaysAgo = await getPricePerFullShare(
    vaultContract,
    threeDaysAgoBlock,
    inceptionBlockNbr
  );

  const now = Date.now();

  const apyInceptionSample = await getApy(
    pricePerFullShareInception,
    pricePerFullShareCurrent,
    inceptionBlockNbr,
    currentBlockNbr
  );

  const apyOneDaySample = await getApy(
    pricePerFullShareOneDayAgo,
    pricePerFullShareCurrent,
    oneDayAgoBlock,
    currentBlockNbr
  );

  const apyThreeDaySample = await getApy(
    pricePerFullShareThreeDaysAgo,
    pricePerFullShareCurrent,
    threeDaysAgoBlock,
    currentBlockNbr
  );

  return {
    apyInceptionSample,
    apyOneDaySample,
    apyThreeDaySample,
  };
};

const readVault = async (vault) => {
  const {
    name,
    symbol,
    description,
    vaultSymbol,
    vaultContractABI: abi,
    vaultContractAddress: address,
  } = vault;
  if (!abi || !address) {
    console.log(`Vault ABI not found: ${name}`);
    return null;
  }
  const contract = new infuraWeb3.eth.Contract(abi, address);
  const apy = await getApyForVault(vault);
  console.log("Vault: ", name, apy);
  const data = {
    address,
    name,
    symbol,
    description,
    vaultSymbol,
    description,
    timestamp: Date.now(),
    ...apy,
  };
  // FIX dynamodb ETH has no adddress
  if (!data.address) data.address = '0x';
  await saveData(data);
  return data;
};

exports.handler = async (context) => {
  console.log("Fetching historical blocks");
  currentBlockNbr = await infuraWeb3.eth.getBlockNumber();
  await delay(delayTime);
  oneDayAgoBlock = currentBlockNbr - nbrBlocksInDay * 1;
  threeDaysAgoBlock = currentBlockNbr - nbrBlocksInDay * 3;
  const vaultsWithApy = [];
  for (const vault of vaults) {
    const vaultWithApy = await readVault(vault);
    if (vaultWithApy !== null) {
      vaultsWithApy.push(vaultWithApy);
    }
    await delay(delayTime);
  }
  console.log(vaultsWithApy);
};
