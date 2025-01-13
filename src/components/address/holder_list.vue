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

                    <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.account.data.parsed.info.owner)">
                        {{ item.account.data.parsed.info.owner }}
                    </td>
                    <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.pubkey)">
                        {{ item.pubkey }}
                    </td>
                    <td>
                        {{  (item.account.data.parsed.info.tokenAmount.uiAmount).toFixed(2)}}
                    </td>
                    <td>
                        {{ percent(item.account.data.parsed.info.tokenAmount.uiAmount, proportion_amount) }} %
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    <div v-if="historyData.length == 0" class="text-center">
        {{ $t("account.available") }}
    </div>
    <div class="justify-end padding-10" v-if="historyData.length != 0">
        <!-- <el-pagination background :hide-on-single-page="true" :page-sizes="[25]" layout="prev, pager, next" :total="historyData.length" /> -->
        <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
            :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import moment from "moment";
import { order } from "../../request/order";
import { chainRequest } from "../../request/chain";
import { proportionAmount } from "../method/proportion_account"
import { useRouter } from "vue-router"
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
        // 解析和处理返回的数据
        console.log(response.result);

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
    console.log(historyData.value);

    proportion_amount.value = await chainRequest(method).then(res => {
        console.log(res);
        
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
    console.log(lod, nem);
    if(nem == 0){
        return 0;
    }
    return (lod / nem * 100).toFixed(2);
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