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

    const firstArray = [
        // 'agyw3hLSqeFEJ46sAmDRjdPtyNZdicPxJPpesfjwj5V',
        'DpisfggNJ86NACUfJPwcgYeANFGzURCPvbRqH3Upcg6y',
        'J93yncWGuZqQtt9M8XCEDP1gjWeAzxk9CAHU5YW1czGj',
        '2KaRRQ5JDsCJo2bLjFP2Q4LpjDj2GgWsKSQKbotrHrh1',
        '48tdsoFWBHDQpz8Y1nJQJULPL1rZB4M7r18iSFcXZSZZ',
        'Avh934GH6j88SZ1paL6KTELV82WtPDcw4Bqeh63bvoAg',
        'HVrVTm4zgTMyRTEGJ2yfwWZEBTwZxoTmkqPBFAtwC8pT',
        '93AEJ5DTCjayr9vs3Djf5u8cXbk6FwNU7fqzS5Cj7UeR',
        'C1uChfoVjJVhyfT2PCLDMR9ZurfYVPcRAJWpYkA8coKP',
        'CQMo616FFpFKnM32uHXQ7iYEuBiBaVKBuv3hc1WFi35Q',
        'Hhf5y1EZVp8F9UE7Zd6BsHtXCJkXmYFb5mTiLcoYnaxV',
        '9WieumoQ86GJCbHjhDf725eRXGHcv6npjoFMMLi2w6LR',
        'CkRzrAyZQkH4y6k2tbEwUPaLC5uotwp6XYj25y2XcAGQ',
        '5Zajh9nmcorSCkiNQzBWJuia8gCJo1WcCiAEMub1BDoM',
    ]

    try {
        const res = await chainRequest(method);
        console.log(res);
        let array = res.result;
        const firstSet = new Set(firstArray);

        // 自定义排序函数
        array.sort((a, b) => {
            const aInFirst = firstSet.has(a.pubkey);
            const bInFirst = firstSet.has(b.pubkey);

            if (aInFirst && !bInFirst) {
                return -1; // a 应该排在 b 前面
            } else if (!aInFirst && bInFirst) {
                return 1;  // a 应该排在 b 后面
            } else {
                return 0;  // 保持原有顺序
            }
        });
        return array;
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

// 按 lamports 降序，若相同则按 supply 降序
// const sortedRes = array.sort((a, b) => {
//     // 第一条件：比较 lamports（降序）
//     const lamportsA = Number(a.account?.lamports) || 0;
//     const lamportsB = Number(b.account?.lamports) || 0;
//     const lamportsDiff = lamportsB - lamportsA;

//     // 如果 lamports 相同，则比较 supply
//     if (lamportsDiff === 0) {
//         const supplyA = Number(a.account?.data?.parsed?.info?.supply) || 0;
//         const supplyB = Number(b.account?.data?.parsed?.info?.supply) || 0;
//         return supplyB - supplyA; // 降序
//     }

//     return lamportsDiff;
// });
// console.log(sortedRes);

// return sortedRes;