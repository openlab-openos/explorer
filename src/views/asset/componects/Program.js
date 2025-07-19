import { chainRequest } from "../../../request/chain"
import {
    Connection,
    PublicKey,
} from '@solana/web3.js';
export async function tokenList() {
    let method = {
        jsonrpc: "2.0",
        id: 1,
        method: "getProgramAccounts",
        params: [
            "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
            {
                encoding: "jsonParsed",
                filters: [
                    {
                        "memcmp": {
                            "offset": 1,
                            "bytes": "1"
                        },
                    }
                ]
            }
        ]
    }

    try {
        const res = await chainRequest(method);
        console.log(res);
        let array = res.result;
        // 按 lamports 降序，若相同则按 supply 降序
        const sortedRes = array.sort((a, b) => {
            // 第一条件：比较 lamports（降序）
            const lamportsA = Number(a.account?.lamports) || 0;
            const lamportsB = Number(b.account?.lamports) || 0;
            const lamportsDiff = lamportsB - lamportsA;

            // 如果 lamports 相同，则比较 supply
            if (lamportsDiff === 0) {
                const supplyA = Number(a.account?.data?.parsed?.info?.supply) || 0;
                const supplyB = Number(b.account?.data?.parsed?.info?.supply) || 0;
                return supplyB - supplyA; // 降序
            }

            return lamportsDiff;
        });
        console.log(sortedRes);

        return sortedRes;
    } catch (err) {
        console.error(`Error fetching accounts for ${token}:`, err);
        return [];
    }
}

export async function getTokenAccounts(token) {
    let method = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getProgramAccounts",
        "params": [
            "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
            {
                "encoding": "jsonParsed",
                "filters": [
                    {
                        "memcmp": {
                            "offset": 0,
                            "bytes": token
                        }
                    }
                ]
            }
        ]
    };
    try {
        const res = await chainRequest(method);
        // console.log(res);

        return amount(res.result
        );
    } catch (err) {
        console.error(`Error fetching accounts for ${token}:`, err);
        return 0;
    }
}

const amount = (array) => {
    let holder = 0;

    for (let i in array) {
        if (array[i].account.data.parsed.info.tokenAmount.uiAmount > 0) {
            holder++;
        }
    }
    return holder;
}