<!-- 通证 -->
<template>
    <div class=" marginTOP-50">
        <card class="md-3">
            <card-body class="card-bodys">
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <th>
                    </th>
                    <tbody v-if="tokenData">
                        <tr>
                            <td>{{ $t("account.token_account") }} </td>
                            <td class="text-end"> {{ url }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.Amount") }} </td>
                            <td class="text-end">
                                {{ come(mintData.supply ?
                                    toFexedStake(mintData.supply, mintData.decimals) : 0) }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.owning_token") }}</td>
                            <td class="text-end"> {{ getMint }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.isFrozen") }} </td>
                            <td class="text-end">{{ tokenData.isFrozen }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.isInitialized") }} </td>
                            <td class="text-end">{{ tokenData.isInitialized }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.isNative") }} </td>
                            <td class="text-end">{{ tokenData.isNative }} </td>
                        </tr>
                        <tr v-if="price">
                            <td>{{ $t("account.symbol") }} </td>
                            <td class="text-end">{{ price.symbol }} </td>
                        </tr>
                    </tbody>
                </table>
            </card-body>
        </card>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { chainRequest } from "../../request/chain";
import { solanagetAccount } from "../../request/solanaGetaccount";
import { PublicKey, Connection } from "@solana/web3.js";
import { solanaRequest } from "../../request/solanaReques";
import { getExtensionData, ExtensionType } from "open-token-web3";
import { metaRequest } from "../../request/tokenMeta";

const tokenData = ref();
const pubbleys = ref();
const getMint = ref();
const mintData = ref();
const price = ref();

const props = defineProps({
    url: {
        typeof: String,
        default: ''
    },
    owner: {
        typeof: String,
        default: ''
    }
});
// const url = ref("9FS3GpfTa98aAUyomeQLFW4HY1GGCn2aFYqp9yr1BQa8");
const url = ref(props.url);
const owner = ref();
let method = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": [
        url.value,
        {
            "encoding": "jsonParsed"
        }
    ]
};
console.log(url.value, owner.value);

const tokenRwquest = async () => {
    await chainRequest(method).then(res => {
      
        owner.value = res.result.value.owner
    })
    console.log(owner.value);

    try {
        solanagetAccount(url.value, owner.value).then(res => {
          
            tokenData.value = res;
            if (res.mintAuthority) {
                let mintAuthorit = res.mintAuthority._bn;
                console.log(mintAuthorit);

                let mintAuthority = BigInt(mintAuthorit);
                pubbleys.value = new PublicKey(mintAuthority);
            }
            if (res.mint) {
                let mint_bn = res.mint._bn.toString();
                let mint = BigInt(mint_bn);

                getMint.value = new PublicKey(mint).toString();

                mintReauest(getMint.value);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

const mintReauest = async (url) => {
    console.log(url);

    await chainRequest(
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getAccountInfo",
            "params": [
                url,
                {
                    "encoding": "jsonParsed"
                }
            ]
        }
    ).then(async resd => {
            console.log(resd.result.value.owner);

            try {
                await solanaRequest(url, resd.result.value.owner).then(res => {
                  
                    mintData.value = res;
                });
                await metaRequest(url, resd.result.value.owner).then(res => {
                  
                    price.value = res;
                });
            } catch (err) {
                console.log(err);
            }
        });
};

onMounted(async () => {
    await tokenRwquest();
});
const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}
const toFexedStake = (num, decimals) => {
    if (num == null || decimals == null) {
        console.error('Number and decimals must be provided.');
        return 0;
    }
    const divisor = Math.pow(10, JSON.parse(decimals));
    console.log(divisor);
    return (JSON.parse(num) / divisor).toFixed(decimals);;

};
</script>