import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount } from "open-token-web3";
const chainStorg =  JSON.parse(sessionStorage.getItem("app"))
const chainData =chainStorg ? chainStorg.chain : '';
export function solanagetAccount(AccountPublicKey, Program) {

    return (async () => {
        // const connection = new Connection("https://api.mainnet.openverse.network", "confirmed");
        // const connection = new Connection("https://api.mainnet.openverse.network/api", "confirmed");
        const connection = new Connection(chainData ? chainData : "https://api.mainnet.openverse.network", "confirmed");

        const tokenAccountPublicKey = new PublicKey(
            AccountPublicKey
        );

        const tokenProgram = new PublicKey(
            Program
        )
        let tokenAccount = await getAccount(connection, tokenAccountPublicKey, undefined, tokenProgram);

        return tokenAccount;
    })();
}