<template>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
        <tbody>
            <tr>
                <th>
                    {{ $t("account.account") }}
                </th>
                <th>
                    {{ $t("account.tokenAccount") }}
                </th>

                <th>
                    {{ $t("account.amount") }}
                </th>
                <th>
                    {{ $t("account.proportion") }}
                </th>
            </tr>
            <template v-if="historyData.length != 0">
                <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                    <td class="text-theme">

                        <text style="cursor: pointer" @click="pubbtx(item.account.data.parsed.info.owner)"> {{
                            titleUrl(item.account.data.parsed.info.owner).url }}</text>
                        <!-- <img v-if="titleUrl(item.account.data.parsed.info.owner).type"
                            v-for="item, index in titleUrl(item.account.data.parsed.info.owner).certificates"
                            :src="item.img" :key="index" height="24" alt="" class="marginRight10"> -->
                        <img v-if="titleUrl(item.account.data.parsed.info.owner).type && !titleUrl(item.account.data.parsed.info.owner).assest"
                            v-for="(datas, indexs) in titleUrl(item.account.data.parsed.info.owner).certificates"
                            :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                        <text v-for="items, indexs in titleUrl(item.account.data.parsed.info.owner).certificates"
                            :key="indexs" :style="'background-color: ' + items.backColor"
                            style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                            {{ items.code }}
                        </text>
                    </td>
                    <td class="text-theme">
                        <text style="cursor: pointer" @click="pubbtx(item.pubkey)">{{ titleUrl(item.pubkey).url
                            }}</text>
                        <img v-if="titleUrl(item.pubkey).type && !titleUrl(item.pubkey).assest"
                            v-for="(datas, indexs) in titleUrl(item.pubkey).certificates" :key="indexs" :src="datas.img"
                            height="24" class="marginRight8" alt="">
                        <text v-for="items, indexs in titleUrl(item.pubkey).certificates" :key="indexs"
                            :style="'background-color: ' + items.backColor"
                            style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                            {{ items.code }}
                        </text>
                    </td>
                    <td>
                        {{ smartFormatNumber(item.account.data.parsed.info.tokenAmount.uiAmount) }}
                    </td>
                    <td>
                        {{ percent(item.account.data.parsed.info.tokenAmount.uiAmount, proportion_amount) }} %
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    <div v-if="historyData.length == 0" class="text-center">
        <loading-vue />
    </div>
    <div v-if="historyData.length == 0 && !loading" class="text-center">
        {{ $t("account.available") }}
    </div>
    <div class="justify-end padding-10" v-if="historyData.length != 0">
        <!-- <el-pagination background :hide-on-single-page="true" :page-sizes="[25]" layout="prev, pager, next" :total="historyData.length" /> -->
        <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
            :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
    </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue';

import moment from 'moment';
import { useRouter } from 'vue-router';

import LoadingVue from '../../components/block/loading.vue';
import { titleUrl } from '../../components/method/title_url';
import { smartFormatNumber } from '../../components/number/smart';
import { chainRequest } from '../../request/chain';
import { order } from '../../request/order';
import { proportionAmount } from '../method/proportion_account';

const loading = ref(true);

const router = useRouter();
const props = defineProps({
    url: {
        type: String,
        default: ""
    },
    paramsId: {
        type: String,
        default: ""
    }
})
const historyData = ref([]);
const proportion_amount = ref(0);
const currentPage = ref(1);
const pageSize = ref(25);

const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return historyData.value.slice(start, end);
});

const totalItems = ref(0);

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

const requestList = async (object) => {
    try {
        const response = await chainRequest(object);


        return response.result; // 现在这个函数会返回解析后的数据
    } catch (error) {
        console.error("Error fetching epoch info:", error);
        return []; // 返回一个空数组或抛出错误取决于你的需求
    }
}


onMounted(async () => {
    historyData.value = await requestList({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getProgramAccounts",
        "params": [
            props.paramsId,
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
    });
    let method = {
        "jsonrpc": "2.0", "id": 1,
        "method": "getTokenSupply",
        "params": [
            // "GragM9tHgicpxtf9qrTkbY1fFZYA8CJaDgLuFnZikdqs"
            props.url
        ]
    };
    totalItems.value = historyData.value.length;
    loading.value = false;

    proportion_amount.value = await chainRequest(method).then(res => {

        return res.result.value.uiAmount;
    }).catch(err => {
        console.log(err);
        return 0;
    });
});

const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}

const timeSome = (time) => {
    return moment(time * 1000).fromNow();
}

const percent = (lod, nem) => {

    if (nem == 0) {
        return 0;
    }
    return (lod / nem * 100).toFixed(5);
}
const pubbtx = (url) => {
    router.push({
        name: "address",
        params: {
            url: url,
        },
    })
}
</script>