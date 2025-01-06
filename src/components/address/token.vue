<!-- 通证 -->
<template>
    <div class="marginTOP-50">
        <card class="md-3">
            <card-body class="card-bodys ">
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <th>
                    <th>{{ $t("account.general_situation") }}</th>
                    <th class="text-end"></th>
                    </th>
                    <tbody v-if="tokenData">
                        <tr>
                            <td>{{ $t("account.foundry_license") }} </td>
                            <td class="text-end"> {{ address == "" ? "" : address }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.freeze_authorization") }} </td>
                            <td class="text-end"> {{ tokenData.decimals }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.supply") }} </td>
                            <td class="text-end"> {{ come(tokenData.supply) }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.number_held") }} </td>
                            <td class="text-end"> {{ holdNumber }} </td>
                        </tr>
                    </tbody>
                </table>
            </card-body>
        </card>
        <card class="md-3 marginTOP-50">
            <card-body class="card-bodys ">
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <th>
                    <th>{{ $t("account.account_authorization") }}</th>
                    <th class="text-end"></th>
                    </th>
                    <tbody v-if="tokenData">
                        <tr>
                            <td>{{ $t("account.foundry_license") }} </td>
                            <td class="text-end"> {{ pubbleys == "" ? "" : pubbleys }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.freeze_authorization") }} </td>
                            <td class="text-end"> {{ tokenData.freezeAuthority == null ? $t("account.no") :
                                tokenData.freezeAuthority }} </td>
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
import { solanaRequest } from "../../request/solanaReques";
import { PublicKey } from "@solana/web3.js";

const tokenData = ref();
console.log(tokenData);
const pubbleys = ref();
const address = ref();
const holdNumber = ref();

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
        try {
            solanaRequest(url.value, res.result.value.owner).then(res => {
                console.log(res);
                tokenData.value = res;
                if (res.mintAuthority) {
                    let mintAuthorit = res.mintAuthority._bn;
                    console.log(mintAuthorit);

                    let mintAuthority = BigInt(mintAuthorit);
                    pubbleys.value = new PublicKey(mintAuthority);
                }
                if (res.address) {
                    let addresses = res.address._bn;
                    let addressCard = BigInt(addresses);
                    address.value = new PublicKey(addressCard);
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
}
const numberHeld = async () => {
    let method = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getProgramAccounts",
        "params": [
            url.value,
            {
                "filters": [
                    {
                        "dataSize": 17
                    },
                    {
                        "memcmp": {
                            "offset": 4,
                            "bytes": "3Mc6vR"
                        }
                    }
                ]
            }
        ]
    }
    chainRequest(method).then(res => {
        console.log(res);
        holdNumber.value = res.result.length;
    });
}
onMounted(async () => {
    await tokenRwquest();
    await numberHeld();
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