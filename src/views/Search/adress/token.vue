<!-- 通证 -->
<template>
    <div>
        <h3 class="align-center">
            <!-- acquiesce -->
            <img :src="token_img ? token_img : ''" alt="" class="marginRight10 imgWigth25" v-if="token_img">
            <img v-if="titleUrl(token_name).type" :src="titleUrl(token_name).img" class="marginRight10 imgWigth25">
            <!-- <text> {{ token_name ? titleUrl(token_name).url : '' }} {{ $t("account.token") }} -->
            <text>
                {{ token_name ? (titleUrl(url).type ? titleUrl(url).url : (token_name == url ? 'Token' : token_name))
                    : 'Token' }}
                <img v-if="titleUrl(url).type && titleUrl(url).assest"
                    v-for="(datas, indexs) in titleUrl(url).certificates" :key="indexs" :src="datas.img"
                    height="24" class="marginRight8" alt=""  @click="pubbley" style="cursor: pointer;">
                <!-- <text v-for="items, indexs in titleUrl(url).certificates" :key="indexs"
                    :style="'background-color: ' + items.backColor"
                    style="border-radius: 5px;padding: 2px 4px;margin: 0px 5px 0 0;font-weight: 500;font-size: 16px;">
                    {{ items.code }}
                </text> -->
            </text>
        </h3>
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
                            <tr v-if="mintToken">
                                <td>{{ $t("account.address_label") }} </td>
                                <td class="text-end"> {{ mintToken.name ? mintToken.name : 'N/A' }} </td>
                            </tr>
                            <tr v-else>
                                <td>{{ $t("account.address_label") }} </td>
                                <td class="text-end">{{ titleUrl(url).find ? titleUrl(url).url : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.symbol") }} </td>
                                <td class="text-end"> {{ mintToken ? (mintToken.symbol ? mintToken.symbol : 'N/A') :
                                    'N/A'
                                    }} </td>
                                <!-- <td class="text-end"> {{ mintToken.symbol ? mintToken.symbol : 'N/A' }} </td> -->
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
                                <td>{{ $t("account.owner") }} </td>
                                <td class="text-end text-theme">
                                    <RenderText :address="paramsId" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </card-body>
            </card>

            <!-- <card class="md-3 marginTOP-50">
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
                                    <text :style="pubbleys ? 'cursor: pointer' : ''" @click="pubbtx(pubbleys)"> {{
                                        !pubbleys ? "N/A" : titleUrl(pubbleys).url }}</text>
                                    <img v-if="titleUrl(pubbleys).type && !titleUrl(pubbleys).assest"
                                        v-for="(datas, indexs) in titleUrl(pubbleys).certificates" :key="indexs"
                                        :src="datas.img" height="24" class="marginRight8" alt="">
                                    <text v-for="items, indexs in titleUrl(pubbleys).certificates" :key="indexs"
                                        :style="'background-color: ' + items.backColor"
                                        style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                        {{ items.code }}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.freeze_authorization") }} </td>
                                <td class="text-end"> {{ tokenData.freezeAuthority == null ? "N/A" :
                                    titleUrl(tokenData.freezeAuthority).url }}
                                    <img v-if="titleUrl(tokenData.freezeAuthority).type"
                                        v-for="(datas, indexs) in titleUrl(tokenData.freezeAuthority).certificates"
                                        :key="indexs" :src="datas.img" height="24" class="marginRight10" alt="">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </card-body>
            </card> -->
            <authorization v-if="url" :url="url"></authorization>
        </div>

        <!-- <div class="tab-content marginTOP-50">
            <card class="md-3">
                <card-body class="card-bodys">
                    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                        <tr>
                            <th>Extension</th>
                            <th class="text-end"></th>
                        </tr>
                        <tbody>
                            <tr>
                                <td>Account status </td>
                                <td class="text-end"> {{ AccountType }} </td>
                            </tr>
                            <tr>
                                <td>Permanent principal </td>
                                <td class="text-end"> {{ TokenPermanentDelegate ? TokenPermanentDelegate : 'N/A' }}
                                </td>
                            </tr>
                            <tr>
                                <td>Handling fee</td>
                                <td class="text-end"> {{ TransactionFee ? TransactionFee.totalFee : 'N/A' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </card-body>
            </card>
        </div> -->
        <!-- <cardView v-if="url" :url="url" /> -->
        <div class="tab-content marginTOP-50">
            <card class="md-3">
                <card-body class="card-bodys">
                    <el-tabs v-model="activeName" class="demo-tabs">
                        <el-tab-pane :label="$t('navigation.transactions')" name="first">
                            <history-view :url="url"></history-view>
                        </el-tab-pane>
                        <el-tab-pane v-if="transfersType" :label="$t('transfer')" name="second">
                            <transfer-view :url="url" :type="false" v-if="activeName == 'second'"></transfer-view>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('account.holder') + ' ' + '(' + holdNumber + ')'" name="third">
                            <holder-view :url="url" :paramsId="paramsId" v-if="activeName == 'third'"></holder-view>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('Margin-record')" name="fourth">
                            <ReserveView :url="url" :paramsId="paramsId" v-if="activeName == 'fourth'" :type="false">
                            </ReserveView>
                        </el-tab-pane>
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

import { useRouter } from 'vue-router';

import { PublicKey } from '@solana/web3.js';
import RenderText from "../../../components/Render/text.vue"
import historyView from '../../../components/address/history_list.vue';
import holderView from '../../../components/address/holder_list.vue';
import pledgeView from '../../../components/address/pledge.vue';
import ReserveView from '../../../components/address/reserve_list.vue';
import transferView from '../../../components/address/transfer_list.vue';
import { titleUrl } from '../../../components/method/title_url';
import { chainRequest } from '../../../request/chain';
import {
    getAccountState,
    getAddressTransactionFees,
    getTokenPermanentDelegate,
} from '../../../request/extension';
import { solanaRequest } from '../../../request/solanaReques';
import { metaRequest } from '../../../request/tokenMeta';
import authorization from './components/authorization.vue';
import cardView from './components/card.vue';

// import {  checkAccountTransferability,getTokenTransferFeeMax } from "../../../request/extension";


const tokenData = ref();
const pubbleys = ref("");
const address = ref();
const holdNumber = ref();
const router = useRouter();
const mintToken = ref();
const activeName = ref('first');
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
    paramsId: {
        typeof: String,
        default: ''
    }
});


// const url = ref("AmXJDzPZoXJX2buwbeg9aL1WUH7CwoNMw2JYFwk2LbKD");
const url = ref(props.url);
const paramsId = ref(props.paramsId);
const token_name = ref("");
const token_img = ref("");
const AccountType = ref("");
const PermanentDelegate = ref('')
const TokenTransferFeeMax = ref("");
const TokenPermanentDelegate = ref("");
const TransactionFee = ref("");

onMounted(async () => {
    AccountType.value = await getAccountState(props.url);
    // PermanentDelegate.value = await checkAccountTransferability(props.url);
    // // console.log(PermanentDelegate.value);
    // TokenTransferFeeMax.value = await getTokenTransferFeeMax(props.url);
    // // console.log(TokenTransferFeeMax.value);
    TokenPermanentDelegate.value = await getTokenPermanentDelegate(url.value, paramsId.value);
    TransactionFee.value = await getAddressTransactionFees(url.value);
});


const tokenName = async (url, params) => {

    try {
        const res = await metaRequest(url, params);
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
const pubbley = () => {
    router.push({
        name: "TokenReputation",
    })
};
const tokenRwquest = async () => {

    // await chainRequest(method).then(res => {

    try {
        solanaRequest(url.value, paramsId.value).then(res => {
            tokenData.value = res;

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
        metaRequest(url.value, paramsId.value).then(res => {

            mintToken.value = res;
        });
    } catch (err) {
        // console.log(err);
    }
    // });
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
            let array = res.result;
            let holder = 0;
            // console.log(array);

            for (let i in array) {
                if (array[i].account.data.parsed.info.tokenAmount.uiAmount > 0) {
                    holder++;
                }
            }
            holdNumber.value = holder;
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
            "name": "Wrap BTG",
            "symbol": "WBTG",
        }
    }
    await tokenName(url.value, props.paramsId);
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

    return (JSON.parse(num) / divisor).toFixed(2);

};
</script>