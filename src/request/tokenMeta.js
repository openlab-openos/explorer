import { Connection, PublicKey } from "@solana/web3.js";
import { getTokenMetadata } from "open-token-web3";
export function metaRequest(AccountPublicKey, Program) {

    
    return (async () => {
        const connection = new Connection("https://us-seattle.openverse.network/api", "confirmed");

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