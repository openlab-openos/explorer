import { Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "open-token-web3";
const chainStorg =  JSON.parse(sessionStorage.getItem("app"))
const chainData =chainStorg ? chainStorg.chain : '';
export function solanaRequest(AccountPublicKey, Program) {
 
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
        
        let mintAccount = await getMint(connection, mintAccountPublicKey, undefined, mintProgram);

        return mintAccount;
    })();
}