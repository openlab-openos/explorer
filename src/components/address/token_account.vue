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
                        <template v-if="mintData">
                            <tr v-if="mintData.supply">
                                <td>{{ $t("account.balance") }} </td>
                                <td class="text-end">
                                    {{ come(mintData.supply ?
                                        toFexedStake(mintData.supply, mintData.decimals) : 0) }}
                                    <span v-if="price">
                                        {{ price.symbol != '' ? "(" + price.symbol + ")" : "" }}
                                    </span>
                                </td>
                            </tr>
                        </template>
                        <tr>
                            <td>{{ $t("account.owning_token") }}</td>
                            <td class="text-end text-theme">
                                <text @click="pubbtx(getMint)" style="cursor: pointer">{{
                                    titleUrl(getMint).url }}</text>
                                <img v-if="titleUrl(getMint).type"
                                    v-for="(datas, indexs) in titleUrl(getMint).certificates" :src="datas.img"
                                    :key="indexs" height="24" class="marginRight8" alt="">
                            </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.state") }} </td>
                            <td class="text-end">{{ tokenData.isFrozen ? $t("account.frozen") : $t("account.initialize")
                                }} </td>
                        </tr>
                        <tr>
                            <td>{{ $t("account.Owner") }} </td>
                            <td class="text-end text-theme">
                                <text @click="pubbtx(owners)" style="cursor: pointer">{{
                                    titleUrl(owners).url }}</text>

                                <!-- <img v-if="titleUrl(owners).type"
                                    v-for="(datas, indexs) in titleUrl(owners).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt=""> -->
                                <img v-if="titleUrl(owners).type && !titleUrl(owners).assest"
                                    v-for="(datas, indexs) in titleUrl(owners).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(owners).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>
                            </td>

                        </tr>
                        <tr>
                            <td>{{ $t("transaction.program") }} </td>
                            <td class="text-end text-theme">
                                <text @click="pubbtx(owners)" style="cursor: pointer">{{
                                    titleUrl(program).url }}</text>
                                <!-- <img v-if="titleUrl(program).type"
                                    v-for="(datas, indexs) in titleUrl(program).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt=""> -->
                                <img v-if="titleUrl(program).type && !titleUrl(program).assest"
                                    v-for="(datas, indexs) in titleUrl(program).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(program).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>
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

import {
  ExtensionType,
  getExtensionData,
} from 'open-token-web3';
import { useRouter } from 'vue-router';

import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

import { chainRequest } from '../../request/chain';
import { solanagetAccount } from '../../request/solanaGetaccount';
import { solanaRequest } from '../../request/solanaReques';
import { metaRequest } from '../../request/tokenMeta';
import { titleUrl } from '../method/title_url';

const router = useRouter();
const tokenData = ref();
const pubbleys = ref();
const getMint = ref();
const mintData = ref();
const price = ref();
const owners = ref();
const program = ref();
const data = ref();

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

const tokenRwquest = async () => {
    try {
        const res = await chainRequest(method);
        owner.value = res.result.value.owner;

        const res2 = await solanagetAccount(url.value, owner.value);


        tokenData.value = res2;
        data.value = res2;

        if (res2.mintAuthority) {
            let mintAuthority = BigInt(res2.mintAuthority._bn);
            pubbleys.value = new PublicKey(mintAuthority);
        }

        if (res2.mint) {
            let mint = BigInt(res2.mint._bn.toString());
            getMint.value = new PublicKey(mint).toString();
            await mintReauest(getMint.value); // Ensure this is awaited
        }

        if (res2.owner) {
            owners.value = new PublicKey(BigInt(res2.owner._bn.toString())).toString();

        }

    } catch (err) {
        console.error(err); // Use console.error for errors
    }
};

const mintReauest = async (url) => {


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
        program.value = resd.result.value.owner;
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

    return (JSON.parse(num) / divisor).toFixed(2);;

};
const pubbtx = (url) => {
    router.push({
        name: "address",
        params: {
            url: url,
        },
    })
}

</script>