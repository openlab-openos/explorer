<!-- 通证 -->
<template>
    <div class="marginTOP-50">
        <card class="md-3">
            <card-body class="card-bodys ">
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <tr>
                        <th>{{ $t("account.general_situation") }}</th>
                        <th class="text-end"></th>
                    </tr>
                    <tbody v-if="tokenData">
                        <tr>
                            <td>{{ $t("account.token_account") }} </td>
                            <td class="text-end"> {{ address == "" ? "" : address }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.name") }} </td>
                            <td class="text-end"> {{ mintToken.name ? mintToken.name : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.symbol") }} </td>
                            <td class="text-end"> {{ mintToken.symbol ? mintToken.symbol : 'N/A' }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("transaction.Decimals") }} </td>
                            <td class="text-end"> {{ tokenData.decimals }} </td>
                        </tr>

                        <tr>
                            <td>{{ $t("account.supply") }} </td>
                            <td class="text-end"> {{ come(toFexedStake(tokenData.supply, tokenData.decimals)) }}
                                <span v-if="mintToken">
                                    {{ mintToken.symbol ? "(" + mintToken.symbol + ")" : "" }}
                                </span>
                                <span v-if="url == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'">
                                    ( WBTG )
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.number_held") }} </td>
                            <td class="text-end"> {{ holdNumber }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.owner") }} </td>
                            <td class="text-end text-theme">
                                <!-- <text style="cursor: pointer" @click="pubbleys(paramsId)">{{
                                    titleUrl(paramsId).url }}</text>
                                <img v-if="titleUrl(paramsId).type && !titleUrl(paramsId).assest"
                                    v-for="(datas, indexs) in titleUrl(paramsId).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(paramsId).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text> -->
                                <RenderText v-if="paramsId" :address="paramsId" />

                            </td>
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
                            <td class="text-end text-theme">
                                <!-- <text :style="pubbleys ? 'cursor: pointer' : ''" @click="pubbtx(pubbleys)">{{
                                    !pubbleys ? "N/A" : titleUrl(pubbleys).url }}</text>
                                <img v-if="titleUrl(pubbleys).type"
                                    v-for="(datas, indexs) in titleUrl(pubbleys).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt=""> -->
                                <RenderText v-if="pubbleys" :address="pubbleys" />

                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.freeze_authorization") }} </td>
                            <td class="text-end"> {{ tokenData.freezeAuthority == null ? "N/A" :
                                titleUrl(tokenData.freezeAuthority).url }}
                                <img v-if="titleUrl(tokenData.freezeAuthority).type"
                                    v-for="(datas, indexs) in titleUrl(tokenData.freezeAuthority).certificates"
                                    :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </card-body>
        </card>
       
    </div>
</template>

<script setup>
import {
  onMounted,
  ref,
} from 'vue';
import RenderText from "../Render/text.vue"
import { useRouter } from 'vue-router';

import { PublicKey } from '@solana/web3.js';

import { chainRequest } from '../../request/chain';
import { solanaRequest } from '../../request/solanaReques';
import { metaRequest } from '../../request/tokenMeta';
import { titleUrl } from '../method/title_url';

const tokenData = ref();
const pubbleys = ref("");
const address = ref();
const holdNumber = ref();
const router = useRouter();
const mintToken = ref();

const props = defineProps({
    url: {
        typeof: String,
        default: ''
    },
    paramsId: {
        typeof: String,
        default: ''
    }
});
const url = ref(props.url);
const paramsId = ref(props.paramsId);
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
    await chainRequest(method).then(res => {
        paramsId.value = res.result.value.owner;


        try {
            solanaRequest(url.value, res.result.value.owner).then(res => {

                // tokenData.value = res;

                if (res.mintAuthority) {
                    let mintAuthorit = res.mintAuthority._bn;

                    let mintAuthority = BigInt(mintAuthorit);
                    pubbleys.value = new PublicKey(mintAuthority);


                }


                if (res.address) {
                    let addresses = res.address._bn;
                    let addressCard = BigInt(addresses);
                    address.value = new PublicKey(addressCard);
                }
            });
            metaRequest(url.value, res.result.value.owner).then(res => {

                mintToken.value = res;
            });
        } catch (err) {
            // console.log(err);
        }
    });
}

// defineEmits({ mintToken });
const numberHeld = async () => {

    let method = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getProgramAccounts",
        "params": [
            paramsId.value,
            // "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
            {
                "encoding": "jsonParsed",
                "filters": [
                    {
                        "memcmp": {
                            "offset": 0,
                            "bytes": props.url
                            // "bytes": "GragM9tHgicpxtf9qrTkbY1fFZYA8CJaDgLuFnZikdqs"
                        }
                    }
                ]
            }
        ]
    }
    chainRequest(method).then(res => {


        if (res.err) {
            holdNumber.value = 0;
        } else {
            holdNumber.value = res.result.length;
        }
    }).catch(() => {
        holdNumber.value = 0;
    });
}
onMounted(async () => {
    await tokenRwquest();

    await numberHeld();
    if (url.value == "B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz") {
        mintToken.value = {
            "name": "netive",
            "symbol": "WBTG",
        }
    }
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

    return (JSON.parse(num) / divisor).toFixed(2);;

};
const pubbtx = (url) => {
    router.push({
        name: "address",
        params: {
            url: url,
        },
    })
};
</script>