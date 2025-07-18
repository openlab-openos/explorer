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
        return res.result;
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

const amount = (array) =>{
    let holder = 0;
    console.log(array);
    
    for( let i in array){
        if(array[i].account.data.parsed.info.tokenAmount.uiAmount > 0){
            holder ++;
        }
    }
    return holder;
}