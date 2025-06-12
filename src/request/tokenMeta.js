import { getTokenMetadata } from 'open-token-web3';

import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

const chainStorg =  JSON.parse(sessionStorage.getItem("app"))
const chainData =chainStorg ? chainStorg.chain : '';
export function metaRequest(AccountPublicKey, Program) {

    
    return (async () => {
        // const connection = new Connection("https://api.mainnet.openverse.network", "confirmed");
        // const connection = new Connection("https://api.mainnet.openverse.network/api", "confirmed");
        const connection = new Connection(chainData ? chainData : "https://api.mainnet.openverse.network", "confirmed");

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