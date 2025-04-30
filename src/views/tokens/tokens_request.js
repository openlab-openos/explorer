import { chainRequest } from "../../request/chain";

// 定义Token列表
let tokenArray = [
    "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    
];

export const tokenList = async () => {
    console.log(123);
    let arrayList = [];

    // 并发执行所有RPC请求
    const requests = tokenArray.map(async (token) => {
        let method = {
            jsonrpc: "2.0",
            id: 1,
            method: "getProgramAccounts",
            params: [
                token,
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
        };
        try {
            const res = await chainRequest(method);
            return res.result;
        } catch (err) {
            console.error(`Error fetching accounts for ${token}:`, err);
            return [];
        }
    });


    const allResults = await Promise.all(requests);
    allResults.forEach(results => {
        arrayList.push(...results);
    });


    return arrayList;
};