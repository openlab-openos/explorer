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
                    <template v-if="tokens.length != 0 && type">
                        <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                            <td class="text-theme" style="line-height: 30px;">
                                <RenderText :address="item.account.data.parsed.info.mint" />
                            </td>
                            <td class="text-theme">
                                <RenderText :address="item.pubkey" />
                            </td>

                            <td class="text-theme">
                                <RenderText :address="item.account.owner" />
                            </td>
                            <td>
                                {{ come(smartFormatNumber(item.account.data.parsed.info.tokenAmount.uiAmount)) }}
                                <text v-if="item.symbol"> {{ '(' + item.symbol + ')' }}</text>
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
import RenderText from "../Render/text.vue"
import { useRouter } from 'vue-router';

import { titleUrl } from '../../components/method/title_url';
import { smartFormatNumber } from '../../components/number/smart';
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
const type = ref(true);
const handlePageChange = (newPage) => {
    type.value = false;
    currentPage.value = newPage;
    setTimeout(() => {
        type.value = true;
    }, 1);
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
const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}
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