import { chainRequest } from "../../request/chain";
import { solanaRequest } from "../../request/solanaReques";

export const solanapubbleys = (url, router) => {
    let method = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getAccountInfo",
        "params": [
            url,
            {
                "encoding": "jsonParsed"
            }
        ]
    };
    chainRequest(method).then(res => {
        console.log(res);
        console.log(res.result.value.owner);

        if (res.result.value.owner == "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c" ||
            res.result.value.owner == "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
            console.log(123);
            try {
                solanaRequest(url, res.result.value.owner).then(res => {
                     router.push({
                        name: "address",
                        params: {
                            url: url,
                            type: "health",
                            // type:"account"
                        },
                    }).then(() => {
                        window.location.reload();
                    });;
                });//通证
            } catch (err) {
                router.push({
                    name: "address",
                    params: {
                        url: url,
                        type: "integration",
                        // type:"account"
                    },
                }).then(() => {
                    window.location.reload();
                });;//通证账户
            }
        } else {
            router.push({
                name: "address",
                params: {
                    url: url,
                    type: "address"
                },
            }).then(() => {
                window.location.reload();
            });;//普通账户或非openverse账户
        }
    });
};