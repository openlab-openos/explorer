import { chainRequest } from "../../request/chain";
import { solanaRequest } from "../../request/solanaReques";

export const solanapubbleys = async (url) => {
    

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

    try {
        const res = await chainRequest(method);
        

        if (res.result.value) {
            if (res.result.value.owner === "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c" ||
                res.result.value.owner === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
                // Await the result of solanaRequest and return it directly.
                return await solanaRequest(url, res.result.value.owner)
                    .then(() => "mint")
                    .catch(() => "integration");
            } else {
                return "address";
            }
        }
    } catch (err) {
        console.error(err); // Log the error for debugging purposes.
        return "address"; // Or handle the error as appropriate.
    }
};