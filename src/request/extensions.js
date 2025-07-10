import {
  ExtensionType,
  getExtensionData,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from 'open-token-web3';
// import {Token} from '@solana/spl-token';
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

// const solanaApiUrl = urlTypeData === 'Test' ? "https://api.devnet.openverse.network" : (chainData ? chainData : "https://api.mainnet.openverse.network");
function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
return !hostname.startsWith('devnet.');
}
const solanaApiUrl = isProductionDomain() ? "https://api.mainnet.openverse.network" : "https://api.devnet.openverse.network";
console.log(isProductionDomain());


const chainStorg = JSON.parse(sessionStorage.getItem("app"));
const chainData = chainStorg ? chainStorg.chain : "";
const connection = new Connection(
  solanaApiUrl,
  "confirmed"
);
let fee = {
  fees: 0,
  maximum: 0,
  default: false,
  non: false,
};
export async function getExtraData(url) {
  console.log("--mintPubkey:", url);
  let mintPubkey = new PublicKey(url);
  console.log("--aa:", mintPubkey);

  const mint = await getMint(
    connection,
    mintPubkey,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("--mint:", mint);

  //get fee
  const transferFeeConfig = getExtensionData(
    ExtensionType.TransferFeeConfig,
    mint.tlvData
  );
  if (!transferFeeConfig) {
    console.log("No TransferFeeConfig found on this mint");
  }
  if (transferFeeConfig) {
    let metadataInfo = TransferFeeConfigLayout.decode(transferFeeConfig);
    console.log("--transferFeeConfig:", metadataInfo);
    fee.fees = metadataInfo.newerTransferFee.transferFeeBasisPoints;
    fee.maximum = metadataInfo.newerTransferFee.maximumFee;
  }

  //get NonTransferable
  const nonTransferableConfig = getExtensionData(
    ExtensionType.NonTransferable,
    mint.tlvData
  );
  console.log("--nonTransferableConfig:", mint);
  // checkTokenAccountFrozen('5Nx2YgDDQ2mmmbYpCN5QY9y7obTqkYHVCzqJpcENdurh')
  console.log("--nonTransferableConfig:", nonTransferableConfig);

  if (!nonTransferableConfig) {
    console.log("No nonTransferableConfig found on this mint");
    fee.non = false;
  }
  if (nonTransferableConfig) {
    // let metadataInfo = NonTransferableLayout.decode(nonTransferableConfig);
    // console.log("--nonTransferableConfig:", metadataInfo);
    fee.non = true;
  }

  //get defaultAccountState
  const defaultAccountConfig = getExtensionData(
    ExtensionType.DefaultAccountState,
    mint.tlvData
  );
  if (!defaultAccountConfig) {
    console.log("No defaultAccountConfig found on this mint");
    fee.default = true;
  }
  if (defaultAccountConfig) {
    let metadataInfo = DefaultAccountStateLayout.decode(defaultAccountConfig);
    if (metadataInfo.state == 2) {
      console.log("--defaultAccountConfig: frozen");
      fee.default = true;
    } else {
      console.log("--defaultAccountConfig", metadataInfo);
      fee.default = false;
    }
  }
  return fee;
}

// async function checkTokenAccountFrozen(tokenAccountPubkey) {
//   const connection = new Connection('https://api.mainnet.openverse.network/');
//   const tokenAccount = await Token.getAccountInfo(
//     connection,
//     new PublicKey(tokenAccountPubkey)
//   );

//   const isFrozen = tokenAccount.isFrozen;
//   console.log(`代币账户冻结状态: ${isFrozen}`);
//   return isFrozen;
// }
