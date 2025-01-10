import { Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "open-token-web3";
export function solanaRequest(AccountPublicKey, Program) {
 
    return (async () => {
        const connection = new Connection("https://us-seattle.openverse.network/api", "confirmed");

        const mintAccountPublicKey = new PublicKey(
            AccountPublicKey
        );

        const mintProgram = new PublicKey(
            Program
        )
        console.log(mintProgram,mintAccountPublicKey);
        
        let mintAccount = await getMint(connection, mintAccountPublicKey, undefined, mintProgram);
        console.log(mintAccount);

        return mintAccount;
    })();
}