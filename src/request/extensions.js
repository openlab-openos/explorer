import {
  ExtensionType,
  getExtensionData,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from 'open-token-web3';

import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

// import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const chainStorg = JSON.parse(sessionStorage.getItem("app"));
const chainData = chainStorg ? chainStorg.chain : "";
const connection = new Connection(
  chainData ? chainData : "https://api.mainnet.openverse.network",
  "confirmed"
);
let fee = {
    fees: 0,
    maximum:0,
    default:false,
    non:false
}
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
    setFee(metadataInfo.newerTransferFee);
  }

  //get NonTransferable
  const nonTransferableConfig = getExtensionData(
    ExtensionType.NonTransferable,
    mint.tlvData
  );
  if (!nonTransferableConfig) {
    console.log("No nonTransferableConfig found on this mint");
    fee.non = false
  }
  if (nonTransferableConfig) {
    let metadataInfo = NonTransferableLayout.decode(nonTransferableConfig);
    console.log("--nonTransferableConfig:", metadataInfo);
    fee.non = true
  }

  //get defaultAccountState
  const defaultAccountConfig = getExtensionData(
    ExtensionType.DefaultAccountState,
    mint.tlvData
  );
  if (!defaultAccountConfig) {
    console.log("No defaultAccountConfig found on this mint");
  }
  if (defaultAccountConfig) {
    let metadataInfo = DefaultAccountStateLayout.decode(defaultAccountConfig);
    if (metadataInfo.state == 2) {
      console.log("--defaultAccountConfig: frozen");
      fee.default = true
    } else {
      console.log("--defaultAccountConfig", metadataInfo);
      fee.default = false
    }
  }
  return fee;
}
