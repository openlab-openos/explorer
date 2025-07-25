import { chainRequest } from "../../request/chain";
import { solanaRequest } from "../../request/solanaReques";

export const proportionAmount = async (url) => {
    let method = {
        "jsonrpc": "2.0", "id": 1,
        "method": "getTokenSupply",
        "params": [
            url
        ]
      };
    chainRequest(method).then(res => {
        return res.result.value.uiAmount;
    }).catch(err => {
        // console.log(err);
        return 0;
    });
};

