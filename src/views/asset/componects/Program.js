// import { chainRequest } from "../../../request/chain"
// import {
//     Connection,
//     PublicKey,
// } from '@solana/web3.js';
// export async function tokenList() {
//     let method = {
//         jsonrpc: "2.0",
//         id: 1,
//         method: "getProgramAccounts",
//         params: [
//             "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
//             {
//                 encoding: "jsonParsed",
//                 filters: [
//                     {
//                         "memcmp": {
//                             "offset": 1,
//                             "bytes": "1"
//                         },
//                     }
//                 ]
//             }
//         ]
//     }

//     const firstArray = [
//         '6YAFesA4VLWzWaxir5Gf1S9LAa6LEXantPVnwZa4UMQJ',
//         'J9adqnYhHtoMUkdEzznNuY9H4pzv4sRHmZ9CDBiJVb6e',
//         '9rbyJYkHJMprnbyEDgK4kNKwvzru1w7AJnoEAGS8oDta',
//         'GnYNT6N14SyBYboSFiJk6TjYUMeKXwh6cwuH2jU27pnP',
//         'GQRUQnJcRMSpNMPZdb9Sz5msy9pa9ypGwgBuwvDzfoqV',
//         'G9NpvA87jtSvEfAqU4EFo2nkYgBifoYHiwQqmdfySKpJ',
//         '2w7axKNBYaedtjamoNoxxGt14peh5pFcXcnunzGYohtu',
//         'GQRUQnJcRMSpNMPZdb9Sz5msy9pa9ypGwgBuwvDzfoqV',
//     ]

//     try {
//         const res = await chainRequest(method);
//         // // console.log(res);
//         let array = res.result;
//         const firstSet = new Set(firstArray);

//         // 自定义排序函数
//         array.sort((a, b) => {
//             const aInFirst = firstSet.has(a.pubkey);
//             const bInFirst = firstSet.has(b.pubkey);

//             if (aInFirst && !bInFirst) {
//                 return -1; // a 应该排在 b 前面
//             } else if (!aInFirst && bInFirst) {
//                 return 1;  // a 应该排在 b 后面
//             } else {
//                 return 0;  // 保持原有顺序
//             }
//         });
//         return array;
//     } catch (err) {
//         console.error(`Error fetching accounts for ${token}:`, err);
//         return [];
//     }
// }

// export async function getTokenAccounts(token) {
//     const method = {
//         "jsonrpc": "2.0",
//         "id": 1,
//         "method": "getProgramAccounts",
//         "params": [
//             "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
//             {
//                 "encoding": "jsonParsed",
//                 "filters": [
//                     {
//                         "memcmp": {
//                             "offset": 0,
//                             "bytes": token
//                         }
//                     }
//                 ]
//             }
//         ]
//     };
//     try {
//         const res = await chainRequest(method);
//         // // console.log(res);

//         return amount(res.result
//         );
//     } catch (err) {
//         console.error(`Error fetching accounts for ${token}:`, err);
//         return 0;
//     }
// }

// const amount = (array) => {
//     let holder = 0;

//     for (let i in array) {
//         if (array[i].account.data.parsed.info.tokenAmount.uiAmount > 0) {
//             holder++;
//         }
//     }
//     return holder;
// }

// // 按 lamports 降序，若相同则按 supply 降序
// // const sortedRes = array.sort((a, b) => {
// //     // 第一条件：比较 lamports（降序）
// //     const lamportsA = Number(a.account?.lamports) || 0;
// //     const lamportsB = Number(b.account?.lamports) || 0;
// //     const lamportsDiff = lamportsB - lamportsA;

// //     // 如果 lamports 相同，则比较 supply
// //     if (lamportsDiff === 0) {
// //         const supplyA = Number(a.account?.data?.parsed?.info?.supply) || 0;
// //         const supplyB = Number(b.account?.data?.parsed?.info?.supply) || 0;
// //         return supplyB - supplyA; // 降序
// //     }

// //     return lamportsDiff;
// // });
// // // console.log(sortedRes);

// // return sortedRes;

import axios from 'axios';

function isProductionDomain() {
    const hostname = window.location.hostname;
    // 检测是否包含 'devnet.' 前缀
    return !hostname.startsWith('test.');
}
const UtlDevnetType = isProductionDomain();
// console.log('UtlDevnetType',UtlDevnetType);

export function tokenList(data) {
    return new Promise((resolve, reject) => {
        axios.get(UtlDevnetType ? `https://test-open.openverse.live/api/tokens?site=openverse&is_all=1` : `https://test-open.openverse.live/api/tokens`,{
            // axios.get(`https://test-open.openverse.live/api/token/hot`,data,{
            // axios.get(`https://open.openverse.live/api/token/some?net=${urlType ? 'mainnet' : 'devnet'}`,data,{
            // axios.get("https://open.openverse.live/api/token/web",data,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res);
            
            resolve(res.data.data);
        }).catch(err => {
            reject(err);
        })
    })
}