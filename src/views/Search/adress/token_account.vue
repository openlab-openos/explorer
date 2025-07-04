<template>
    <div>
        <h3 class="align-center">
            <img :src="token_img ? token_img : ''" alt="" class="marginRight10 imgWigth25" v-if="token_img">
            <img v-if="titleUrl(token_name).type" :src="titleUrl(token_name).img" class="marginRight10 imgWigth25">
            <text> {{ $t("account.tokenAccount") }} {{ token_name ? (titleUrl(url).find ? titleUrl(url).url : '') : ''
                }}
                <img v-if="titleUrl(url).type" v-for="item, index in titleUrl(url).certificates" :src="item.img"
                    :key="index" height="24" alt="" class="marginRight10">
            </text>
        </h3>

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
                                <td>{{ $t("account.address_label") }} </td>
                                <td class="text-end"> {{ price ? price.name : 'N/A' }} </td>
                            </tr>

                            <template v-if="mintData">
                                <tr>
                                    <td>{{ $t("account.balance") }} </td>
                                    <td class="text-end">
                                        <!-- {{ mintData }} -->
                                        {{ mintData.value.uiAmount }}
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
                                    <img v-if="titleUrl(getMint).type && !titleUrl(getMint).assest"
                                        v-for="(datas, indexs) in titleUrl(getMint).certificates" :key="indexs"
                                        :src="datas.img" height="24" class="marginRight8" alt="">
                                    <text v-for="items, indexs in titleUrl(getMint).certificates" :key="indexs"
                                        :style="'background-color: ' + items.backColor"
                                        style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                        {{ items.code }}
                                    </text>

                                </td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.state") }} </td>
                                <td class="text-end">{{ tokenData.isFrozen ? $t("account.frozen") :
                                    $t("account.initialize")
                                }} </td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.Owner") }} </td>
                                <td class="text-end text-theme">
                                    <text @click="pubbtx(owners)" style="cursor: pointer">{{
                                        titleUrl(owners).url }} </text>
                                    <img v-if="titleUrl(owners).type"
                                        v-for="(datas, indexs) in titleUrl(owners).certificates" :key="indexs"
                                        :src="datas.img" height="24" class="marginRight8" alt="">
                                </td>
                            </tr>
                            <tr>
                                <td>{{ $t("transaction.program") }} </td>
                                <td class="text-end text-theme">
                                    <text @click="pubbtx(owner)" style="cursor: pointer">{{
                                        titleUrl(owner).url }}</text>
                                    <img v-if="titleUrl(owner).type"
                                        v-for="(datas, indexs) in titleUrl(owner).certificates" :key="indexs"
                                        :src="datas.img" height="24" class="marginRight8" alt="">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </card-body>
            </card>
        </div>
        <div class="tab-content marginTOP-50">
            <card class="md-3">
                <card-body class="card-bodys">
                    <el-tabs v-model="activeName" class="demo-tabs">
                        <el-tab-pane :label="$t('navigation.transactions')" name="first">
                            <history-view :url="url"></history-view>
                        </el-tab-pane>
                        <el-tab-pane v-if="transfersType" :label="$t('transfer')" name="second">
                            <transfer-view :url="url" :type="true"></transfer-view>
                        </el-tab-pane>
                        <!-- <el-tab-pane :label="$t('account.holder')" name="third">
                            <holder-view :url="url" :paramsId="owner"></holder-view>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('pledge')" name="fourth">
                            <pledgeView :url="url" :owner="owner" />
                        </el-tab-pane> -->
                    </el-tabs>
                </card-body>
            </card>
        </div>
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

import historyView from '../../../components/address/history_list.vue';
import holderView from '../../../components/address/holder_list.vue';
import pledgeView from '../../../components/address/pledge.vue';
import transferView from '../../../components/address/transfer_list.vue';
import { titleUrl } from '../../../components/method/title_url';
import { chainRequest } from '../../../request/chain';
import { solanagetAccount } from '../../../request/solanaGetaccount';
import { solanaRequest } from '../../../request/solanaReques';
import { metaRequest } from '../../../request/tokenMeta';

const router = useRouter();
const tokenData = ref();
const pubbleys = ref();
const getMint = ref();
const mintData = ref();
const price = ref();
const owners = ref();
const program = ref();
const data = ref();
const activeName = ref('first')

function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
  return !hostname.startsWith('devnet.');
}
const transfersType = isProductionDomain();

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
const owner = ref(props.owner);
const token_name = ref("");
const token_img = ref("");
const tokenName = async (url, params) => {

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
        const params = await chainRequest(method);
        const res = await metaRequest(url, params.result.value.owner);
        if (res) {
            token_name.value = res.name ? res.name : '';
            token_img.value = res.uri ? res.uri : "";
        } else {
            token_name.value = url;
        }

    } catch (error) {

        token_name.value = url;
        console.error("Error fetching token info:", error);
    }
}
const tokenRwquest = async () => {

    try {
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
            await tokenName(getMint.value);
        }

        if (res2.owner) {
            owners.value = new PublicKey(BigInt(res2.owner._bn.toString())).toString();
        }

    } catch (err) {
        console.error(err); // Use console.error for errors
    }
};

const mintReauest = async (url) => {

    try {
        // await solanaRequest(url, owner.value).then(res => {
        //     console.log(res);

        //     mintData.value = res;
        // });
        console.log(url);

        await chainRequest({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTokenAccountBalance",
            "params": [
                props.url
            ]
        }).then(res => {
            console.log(res);
            mintData.value = res.result;
        });
        await metaRequest(url, owner.value).then(res => {
            console.log(res);

            price.value = res;
        });
    } catch (err) {
        console.log(err);
    }
    // });
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