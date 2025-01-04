import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getMint } from "open-token-web3";
export function solanagetAccount(AccountPublicKey, Program) {

    return (async () => {
        const connection = new Connection("https://us-seattle.openverse.network/api", "confirmed");

        const mintAccountPublicKey = new PublicKey(
            AccountPublicKey
        );

        const mintProgram = new PublicKey(
            Program
        )
        let mintAccount = await getAccount(connection, mintAccountPublicKey, undefined, mintProgram);
        console.log(mintAccount);

        return mintAccount;
    })();
}