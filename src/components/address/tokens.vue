<template>
    <card class="md-3">
        <card-body class="card-bodys ">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <th>
                <th>{{ $t("account.tokens") }}</th>
                <th class="text-end"></th>
                </th>
                <tbody>
                    <tr>
                        <th>
                            {{ $t("account.token") }}
                        </th>
                        <th>
                            {{ $t("account.tokenAccount") }}
                        </th>

                        <th>
                            {{ $t("transaction.program") }}
                        </th>
                        <th>
                            {{ $t("account.uiamount") }}
                        </th>
                    </tr>
                    <template v-if="tokens.length != 0">
                        <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                            <td class="text-theme" style="cursor: pointer;line-height: 30px;"
                                @click="pubbtx(item.account.data.parsed.info.mint)">
                                <img v-if="item.img" :src="item.img" height="28" alt="">
                                <img v-if="item.account.data.parsed.info.mint == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'"
                                    src="https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png"
                                    width="28" height="28" alt="">
                                {{ titleUrl(item.account.data.parsed.info.mint).url }}
                                <text v-if="item.name">{{ '(' + item.name + ')' }}</text>
                                <text
                                    v-if="item.account.data.parsed.info.mint == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'">(Native)</text>
                                &nbsp;

                                <img v-if="titleUrl(item.account.data.parsed.info.mint).type && !titleUrl(item.account.data.parsed.info.mint).assest"
                                    v-for="(datas, indexs) in titleUrl(item.account.data.parsed.info.mint).certificates"
                                    :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.account.data.parsed.info.mint).certificates"
                                    :key="indexs" :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>
                            </td>
                            <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.pubkey)">
                                {{ titleUrl(item.pubkey).url }}
                                <img v-if="titleUrl(item.pubkey).type && !titleUrl(item.pubkey).assest"
                                    v-for="(datas, indexs) in titleUrl(item.pubkey).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.pubkey).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>
                            </td>

                            <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.account.owner)">
                                {{ titleUrl(item.account.owner).url }}
                                <img v-if="titleUrl(item.account.owner).type && !titleUrl(item.account.owner).assest"
                                    v-for="(datas, indexs) in titleUrl(item.account.owner).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.account.owner).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>
                            </td>
                            <td>
                                {{ tokenNumber(item.account.data.parsed.info.tokenAmount.uiAmount) }}
                                <img v-if="titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).type && !titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).assest"
                                    v-for="(datas, indexs) in titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).certificates"
                                    :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                                <text
                                    v-for="items, indexs in titleUrl(item.account.data.parsed.info.tokenAmount.uiAmountr).certificates"
                                    :key="indexs" :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>
                                <text v-if="item.symbol"> {{ '(' + item.symbol + ')' }}</text>
                                <text v-if="titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).symbol">({{
                                    titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).symbol }})</text>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </card-body>
        <div v-if="tokens.length == 0" class="text-center">
            {{ $t("account.available") }}
        </div>
        <div class="justify-end padding-10" v-if="tokens.length != 0">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
                :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
        </div>
    </card>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue';

import { useRouter } from 'vue-router';

import { titleUrl } from '../../components/method/title_url';
import { chainRequest } from '../../request/chain';

const router = useRouter();
const props = defineProps({
    tokens: Array,
});
const data = ref(props.tokens);
const currentPage = ref(1);
const pageSize = ref(10);
const tokenData = ref();
const totalItems = ref(props.tokens.length);
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return props.tokens.slice(start, end);
});
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};
const tokenList = async () => {
    let method = {
        jsonrpc: "2.0",
        id: 1,
        method: "getProgramAccounts",
        params: [
            "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
            {
                encoding: "jsonParsed",
                filters: [
                    {
                        "memcmp": {
                            "offset": 1,
                            "bytes": "1"
                        },
                    }
                ]
            }
        ]
    };
    try {
        const res = await chainRequest(method);

        tokenData.value = res.result;
        return res.result;
    } catch (err) {
        console.error(`Error fetching accounts for ${token}:`, err);
        return [];
    }
}
onMounted(async () => {
    await tokenList();

    if (tokenData.value) {
        for (let i in tokenData.value) {
            for (let j in data.value) {
                if (tokenData.value[i].pubkey == data.value[j].account.data.parsed.info.mint) {

                    if (tokenData.value[i].account.data.parsed.info.extensions) {

                        for (let a in tokenData.value[i].account.data.parsed.info.extensions) {
                            if (tokenData.value[i].account.data.parsed.info.extensions[a].extension == "tokenMetadata") {

                                data.value[j].img = tokenData.value[i].account.data.parsed.info.extensions[a].state.uri;
                                data.value[j].name = tokenData.value[i].account.data.parsed.info.extensions[a].state.name;
                                data.value[j].symbol = tokenData.value[i].account.data.parsed.info.extensions[a].state.symbol;

                            }
                        }
                    }
                }
            }
        }
    }
})
const tokenNumber = (num) => {
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
};
const pubbtx = (item) => {
    router.push({
        name: "address",
        params: {
            url: item,
        },
    });
};
</script>