import { getTokenMetadata } from 'open-token-web3';

import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

const chainStorg =  JSON.parse(sessionStorage.getItem("app"))
const chainData =chainStorg ? chainStorg.chain : '';
const currentUrl = window.location.href;
// console.log(currentUrl);


// import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
function isProductionDomain() {
    const hostname = window.location.hostname;
    // 检测是否包含 'devnet.' 前缀
  return !hostname.startsWith('devnet.');
}
// console.log(isProductionDomain());

const solanaApiUrl = isProductionDomain() ? "https://api.mainnet.openverse.network" : "https://api.devnet.openverse.network";

export function metaRequest(AccountPublicKey, Program) {

    
    return (async () => {
        // const connection = new Connection("https://api.mainnet.openverse.network", "confirmed");
        // const connection = new Connection("https://api.mainnet.openverse.network/api", "confirmed");
        const connection = new Connection(solanaApiUrl, "confirmed");

        const mintAccountPublicKey = new PublicKey(
            AccountPublicKey
        );

        const mintProgram = new PublicKey(
            Program
        )
  
        let mintAccount = await getTokenMetadata(connection, mintAccountPublicKey, undefined, mintProgram);

        return mintAccount;
    })();
}