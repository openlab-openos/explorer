<template>
    <div>
        <h3>
            <!-- {{ card_data[0] == null ? $t("account.title") : (card_data[0].executable ? $t("account.program_title") :
                $t("account.title"))
                 }} -->
            {{ card_data[0] == null ? "Account" : (card_data[0].executable ? $t("Program") : "Account") }}
        </h3>

        <div v-if="type">
            <card class="md-3 ">
                <card-body class="card-bodys">
                    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                        <th>
                        <td>{{ $t("account.overview") }} </td>
                        <td class=" text-end"></td>
                        </th>
                        <tbody v-for="(item, index) in card_data" :key="index">
                            <tr>
                                <td>{{ $t("account.address") }} </td>
                                <td class="text-end">{{ url }}</td>
                            </tr>
                            <tr v-if="promaster[url]">
                                <td>{{ $t("account.address_label") }} </td>
                                <td class="text-end">{{ promaster[url].name }}</td>
                            </tr>
                            <tr v-else>
                                <td>{{ $t("account.address_label") }} </td>
                                <td class="text-end">{{ titleUrl(url).find ? titleUrl(url).url : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.balance") }} (BTG)</td>
                                <td class="text-end"> {{ card_data[index] == null ? 'Account does not exist' :
                                    come(smartFormatNumber(toFexedStake(item.lamports / 1000000000))) }} </td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.allocated_data_size") }} </td>
                                <td class="text-end"> {{ card_data[index] == null ? '0' : item.space }} byte(s)</td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.assigned_program_id") }} </td>
                                <td class="text-end text-theme">
                                    <text style="cursor: pointer" @click="pubbtx(item.owner)"> {{
                                        titleUrl(item.owner).url }}</text>
                                    <img v-if="titleUrl(item.owner).type && !titleUrl(item.owner).assest"
                                        v-for="(datas, indexs) in titleUrl(item.owner).certificates" :key="indexs"
                                        :src="datas.img" height="24" class="marginRight8" alt="">
                                    <text v-for="items, indexs in titleUrl(item.owner).certificates" :key="indexs"
                                        :style="'background-color: ' + items.backColor"
                                        style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                        {{ items.code }}
                                    </text>
                                </td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.executable") }} </td>
                                <td class="text-end"> {{ card_data[index] == null ? 'NO' : (item.executable ? 'YES' :
                                    'NO') }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </card-body>
            </card>
        </div>
        <div v-else>
            <card class="md-3">
                <card-body class="card-bodys">
                    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                        <th>
                        <td>{{ $t("account.overview") }} </td>
                        <td class=" text-end"></td>
                        </th>
                        <tbody>
                            <tr>
                                <td>{{ $t("account.address") }} </td>
                                <td class="text-end">{{ url }}</td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.blance") }} (BTG)</td>
                                <td class="text-end" style="color: red;"> {{ $t("account.error") }}</td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.allocated_data_size") }}</td>
                                <td class="text-end"> 0 byte(s)</td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.assigned_program_id") }}</td>
                                <td class="text-end text-theme" >
                                    {{ $t("account.native_label") }}
                                </td>
                            </tr>
                            <tr>
                                <td>{{ $t("account.executable") }}</td>
                                <td class="text-end"> NO
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </card-body>
            </card>
        </div>
        <div class="tab-content marginTOP-50" v-if="menu.length != 0">
            <tokens-View :tokens="menu"></tokens-View>
        </div>
        <div class="tab-content marginTOP-50" v-if="card_data[0]">
            <card class="md-3">
                <card-body class="card-bodys">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <el-tab-pane :label="$t('navigation.transactions')" name="first">
                            <history-view :url="url"></history-view>
                        </el-tab-pane>
                        <el-tab-pane v-if="transfersType.urlType == 'Formal' && type && !card_data[0].executable"
                            :label="$t('transfer')" name="second">
                            <transfer-view :url="url" :type="true" v-if="activeName == 'second'"></transfer-view>
                        </el-tab-pane>
                        <el-tab-pane v-if="transfersType.urlType == 'Formal' && type && !card_data[0].executable"
                            :label="$t('pledge')" name="third">
                            <pledgeView v-if="activeName == 'third'" :url="url" />
                        </el-tab-pane>
                    </el-tabs>
                </card-body>
            </card>
        </div>
    </div>
</template>
<script setup>
import {
  getCurrentInstance,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue';

import { useRouter } from 'vue-router';

import historyView from '../../../components/address/history_list.vue';
import holderView from '../../../components/address/holder_list.vue';
import pledgeView from '../../../components/address/pledge.vue';
import ReserveView from '../../../components/address/reserve_list.vue';
import tokensView from '../../../components/address/tokens.vue';
import transferView from '../../../components/address/transfer_list.vue';
import { titleUrl } from '../../../components/method/title_url';
import { smartFormatNumber } from '../../../components/number/smart.js';
import { chainRequest } from '../../../request/chain';

const router = useRouter();
const type = ref(true);
const props = defineProps({
    url: {
        type: String,
        default: ""
    },
});

const url = ref(props.url);
const card_data = ref([]);
const apps = getCurrentInstance()
const menu = ref([]);
const activeName = ref('first')
const promaster = apps?.proxy?.$progream;
console.log(1111);

onMounted(async () => {
    console.log(1111);

    await pubbleys(props.url)
    await menufunction(props.url);

})
const transfersType = JSON.parse(sessionStorage.getItem('urlType'));

const paramsId = ref([
    "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
]);
const pubbleys = async (url) => {
    let cardData = await requestList({
        jsonrpc: "2.0",
        id: 1,
        method: "getMultipleAccounts",
        params: [
            [url],
            {
                commitment: "confirmed",
                encoding: "jsonParsed",
            },
        ],
    });

    if (cardData) {
        if (cardData.value[0] != null) {
            card_data.value = cardData.value;
            type.value = true

        } else {
            type.value = false
        }
    } else {
        type.value = false
    }
}
const requestList = async (object) => {
    console.log(1111);

    try {
        const response = await chainRequest(object);
        // 解析和处理返回的数据
        console.log(response);

        return response.result; // 现在这个函数会返回解析后的数据
    } catch (error) {
        return []; // 返回一个空数组或抛出错误取决于你的需求
    }
}
const toFexedStake = (num) => {
    if (typeof num !== 'number') {
        throw new TypeError('The input must be a number.');
    }

    // 检查整数部分是否大于1
    if (Math.floor(Math.abs(num)) > 1) {
        return Number(num).toFixed(2);
    } else if (Math.abs(num) < 1 && num !== 0) {
        // 对于绝对值小于1且非零的数，保留5位小数
        return Number(num).toFixed(5);
    } else {
        // 如果是0或者整数部分等于1，则不做特殊处理，直接返回原值
        return num.toString();
    }
}
const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}
const menufunction = async (url) => {
    for (let i in paramsId.value) {
        let methods =
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTokenAccountsByOwner",
            "params": [
                url,
                {
                    "programId": paramsId.value[i]
                },
                {
                    "encoding": "jsonParsed"
                }
            ]
        }

        let datas = await requestList(methods);


        if (datas) {
            for (let i in datas.value) {
                menu.value.push(datas.value[i])
            }
        }


    }
}
const pubbtx = (url) => {
    router.push({
        name: "address",
        params: {
            url: url,
        },
    }).then(() => {
        window.location.reload()
    })
};
</script>
