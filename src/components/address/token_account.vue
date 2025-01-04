<!-- 通证 -->
<template>
    <card class="md-3" >
        <card-body class="card-bodys" >
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <th>
                </th>
                <tbody v-if="tokenData">
                    <tr>
                        <td>{{ $t("account.mint_account") }} </td>
                        <td class="text-end"> {{ pubbleys == "" ? "" : pubbleys }} </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.Amount") }} </td>
                        <td class="text-end"> {{ come(tokenData.supply ?
                            toFexedStake(tokenData.supply,tokenData.decimals) : 0) }} </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.status") }} (BTG)</td>
                        <td class="text-end"> {{ tokenData.isInitialized }} </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.freezeAuthority") }} </td>
                        <td class="text-end">{{ tokenData.freezeAuthority == null ? 'false' : 'true' }} </td>
                    </tr>
                </tbody>
            </table>
        </card-body>
    </card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { chainRequest } from "../../request/chain";
import { solanagetAccount } from "../../request/solanaGetaccount";
import { PublicKey } from "@solana/web3.js";

const tokenData = ref();
console.log(tokenData);
const pubbleys = ref();

const props = defineProps({
    url: {
        typeof: String,
        default: ''
    }
});
// const url = ref("GragM9tHgicpxtf9qrTkbY1fFZYA8CJaDgLuFnZikdqs");
const url = ref(props.url);
const tokenRwquest = async () => {
    let method = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getAccountInfo",
        "params": [
            // props.url,
            url.value,
            {
                "encoding": "jsonParsed"
            }
        ]
    };
    chainRequest(method).then(res => {
        console.log(res);

        console.log(res.result.value.owner);

        try {
            solanagetAccount(url.value, res.result.value.owner).then(res => {
                console.log(res);
                tokenData.value = res;
                if (res.mintAuthority) {
                    let mintAuthorit = res.mintAuthority._bn;
                    console.log(mintAuthorit);

                    let mintAuthority = BigInt(mintAuthorit);
                    pubbleys.value = new PublicKey(mintAuthority);
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
}
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