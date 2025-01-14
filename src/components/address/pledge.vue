<template>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
        <tbody>
            <tr>
                <th>
                    VoterPubkey
                </th>
                <th>
                    Amount&nbsp;(BTG)
                </th>
                <th>
                    State
                </th>
                <th>
                    Time Remaining
                </th>
            </tr>
            <template v-if="historyData.length != 0">
                <tr v-for="(item, index) in paginatedHistoryData" :key="index">

                    <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.account.data.parsed.info.stake.delegation.voter)">
                        {{ item.account.data.parsed.info.stake.delegation.voter }}
                    </td>
                    <td>
                        {{ percent(item.account.data.parsed.info.stake.delegation.stake) }}
                    </td>
                    <td
                        :style="item.state == 'active' ? 'color:rgba(60,210,165,1)' : (item.state == 'inactive' ? 'color:rgba(60,210,165,1)' : 'color:rgba(225,250,7,1)')">
                        {{ item.state }}
                    </td>
                    <td>
                        {{ item.state != 'deactivating' ? (item.state == "activating" ? item.time : '') : item.time }}
                        <!-- {{ fetchData() }} -->
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
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';


const connection = new Connection("https://us-seattle.openverse.network/api", "confirmed");

const router = useRouter();
const props = defineProps({
    url: {
        type: String,
        default: ""
    },
})
const historyData = ref([]);
const proportion_amount = ref(0);
const currentPage = ref(1);
const pageSize = ref(25);
const solttime = ref();

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
            "Stake11111111111111111111111111111111111111",
            {
                "encoding": "jsonParsed",
                "filters": [
                    {
                        "memcmp": {
                            "offset": 12,
                            "bytes": props.url
                        }
                    }
                ]
            }
        ]
    });
    for (let i in historyData.value) {
        historyData.value[i].state = await stateFunction(historyData.value[i].pubkey);
        historyData.value[i].time = await fetchData();
    }

    totalItems.value = historyData.value.length;
});

const stateFunction = async (url) => {
    const userPubKey = new PublicKey(url);
    try {
        const res = await connection.getStakeActivation(userPubKey)
        console.log(res);
        return res.state;
    } catch (err) {
        console.log(err);
    }

}
const fetchData = async () => {
    try {
        const requestBody = {
            jsonrpc: "2.0",
            id: 1,
            method: "getEpochInfo",
            params: [],
        };
        const response = await chainRequest(requestBody);
        solttime.value = getTime(
            response.result.slotsInEpoch - response.result.slotIndex
        );
        console.log(solttime.value);
        return solttime.value;
    } catch (error) {
        console.error("Error fetching epoch info:", error);
    }
};
const getTime = (timestamp) => {
    return moment(JSON.parse(moment().format("x")) + timestamp * 400).fromNow();
};
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

const percent = (lod) => {

    return (lod / 1000000000).toFixed(5);
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