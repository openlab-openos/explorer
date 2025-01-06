import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount } from "open-token-web3";
export function solanagetAccount(AccountPublicKey, Program) {

    return (async () => {
        const connection = new Connection("https://us-seattle.openverse.network/api", "confirmed");

        const tokenAccountPublicKey = new PublicKey(
            AccountPublicKey
        );

        const tokenProgram = new PublicKey(
            Program
        )
        let tokenAccount = await getAccount(connection, tokenAccountPublicKey, undefined, tokenProgram);
        console.log(tokenAccount);

        return tokenAccount;
    })();
}