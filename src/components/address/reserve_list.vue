<template>
    <div v-if="!reserveType" class="releasedBox">
        <div class="releasedChild">
            <h3>{{ $t("not-been-released") }}</h3>
            <h4>
                <p class="releasedAmount">{{ amountReserve(historyData, false) }} BTG</p>
            </h4>
        </div>
        <div class="releasedChild">
            <h3>{{ $t("have-been-released") }}</h3>
            <h4>
                <p class="releasedAmount"> {{ smartFormatNumber(amountReserve(historyData, true)) }}BTG</p>
            </h4>
        </div>
    </div>
    <div class="EChartsBox">
        <apexchart :height="chart.height" :options="chart.options" :series="chart.series" style="margin-top: -10px;">
        </apexchart>

    </div>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small" v-if="!loading">
        <tbody>
            <tr>
                <th>
                    {{ $t("stakeTime") }}
                </th>
                <th>
                    {{ $t("last_time") }}
                </th>
                <!-- <th>
                    {{ $t("account.owner") }}
                </th> -->
                <th>
                    {{ $t("stage") }}
                </th>
                <th>
                    {{ $t("account.destination") }}
                </th>
                <th v-if="reserveType">
                    {{ $t("mint") }}
                </th>
                <th v-else>
                    {{ $t("account.Owner") }}
                </th>
            </tr>
            <template v-if="historyData.length != 0">
                <tr v-for="(item, index) in paginatedHistoryData" :key="index" style="cursor: pointer"
                    @click="detailsFunction(item.child)">
                    <td>
                        <!-- {{ item.child[0].startTime }} -->
                        {{ formatTimestamp(item.startTime) }}
                    </td>
                    <td>
                        <!-- {{ item.child[0].startTime }} -->
                        {{ formatTimestamp(item.endTime) }}
                    </td>
                    <!-- <td>
                        {{ come(item.serial) }}
                    </td> -->
                    <td>
                        {{ item.futureCount + ' / ' + item.child.length }}
                    </td>
                    <td>
                        <!-- {{ come(toFexedStake(item.amount)) }} -->
                        {{ come(smartFormatNumber(toFexedStake(item.amount))) }}

                    </td>
                    <td class="text-theme" v-if="reserveType">
                        {{ titleUrl(item.child[0].mint).type ? titleUrl(item.child[0].mint).url :
                            stringcate(item.child[0].mint) }}
                        <img v-if="titleUrl(item.child[0].mint).type"
                            v-for="item, index in titleUrl(item.child[0].mint).certificates" :src="item.img"
                            :key="index" width="24" alt="" class="marginRight10">
                    </td>
                    <td class="text-theme" v-else>
                        {{ titleUrl(item.child[0].owner).type ? titleUrl(item.child[0].owner).url :
                            stringcate(item.child[0].owner) }}
                        <img v-if="titleUrl(item.child[0].owner).type"
                            v-for="item, index in titleUrl(item.child[0].owner).certificates" :src="item.img"
                            :key="index" width="24" alt="" class="marginRight10">
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
    <div v-if="loading" class="text-center">
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
import { onMounted, ref, computed } from "vue";
import moment from "moment";
import { order } from "../../request/order";
import { chainRequest } from "../../request/chain";
import { proportionAmount } from "../method/proportion_account"
import { useRouter } from "vue-router"
import { Transaction } from "@solana/web3.js";
import { parseNFTMetadata } from "../../request/reserve"
import { titleUrl } from "../method/title_url"
import LoadingVue from "../../components/block/loading.vue"
import { decodeLockAccount } from "../../request/record";
import { lo } from "element-plus/es/locale/index.mjs";
import { start } from "@popperjs/core";
import apexchart from "@/components/plugins/Apexcharts.vue";
import { useAppVariableStore } from "@/stores/app-variable";
import { smartFormatNumber } from "../../components/number/smart"
import { setData } from "../../views/Search/adress/components/event-bus"
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
    },
    type: {
        type: Boolean,
        default: false
    }
})
const appVariable = useAppVariableStore();

const historyData = ref([]);
const proportion_amount = ref(0);
const currentPage = ref(1);
const pageSize = ref(25);
const url = ref(props.url);
const paramsId = ref(props.paramsId);
const reserveType = ref(props.type);
const releasedArray = ref([]);
const unreleasedArray = ref([]);

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
    setTimeout(() => {
        loading.value = false;
    }, 3000);
    let data;
    data = await requestList(
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getProgramAccounts",
            "params": [
                "vrccD48wXDoZbj9t6xu7X2362Lr9yyocMB7aq9GVaym",
                {
                    "filters": [
                        {
                            "memcmp": {
                                "offset": 8,
                                "bytes": url.value
                            }
                        }
                    ]
                }
            ]
        }
    );

    for (let i = 0; i < data.length; i++) {
        data[i].metadata = decodeLockAccount(data[i].account.data);
    }
    // console.log(historyData.value);
    historyData.value = groupBySerialNumber(data);
    console.log(historyData.value);

    totalItems.value = historyData.value.length;

});

function groupBySerialNumber(arr) {
    const grouped = {};
    arr.forEach(item => {
        const key = item.metadata.serialNumber;
        if (!grouped[key]) {
            grouped[key] = {
                serial: key,
                startTime: item.metadata.startTime,
                endTime: item.metadata.endTime, // 存储endTime用于后续比较
                child: [],
                amount: 0,
                futureCount: 0,// 初始化未来时间数量
                released: 0,
                unreleased: 0,
                releasedArray: [],
                unreleasedArray: [],
            };
        }
        grouped[key].child.push(item.metadata);
        grouped[key].amount += parseFloat(item.metadata.amount) || 0;

        // 统计child中endTime大于当前时间的数量
        const currentTime = Math.floor(Date.now() / 1000);


        if (parseInt(item.metadata.endTime) > currentTime) {
            // grouped[key].futureCount++;
            grouped[key].released += parseFloat(item.metadata.amount) || 0;
            grouped[key].releasedArray.push(item.metadata.amount);
            grouped[key].unreleasedArray.push(0);
        } else {
            console.log(parseInt(item.metadata.endTime, 10));
            console.log(currentTime);
            grouped[key].futureCount++;
            grouped[key].releasedArray.push(0);
            grouped[key].unreleasedArray.push(item.metadata.amount);
            if (!item.metadata.isUnlocked) {
                grouped[key].unreleased += parseFloat(item.metadata.amount) || 0;

            }
        }
    });
    console.log(Object.values(grouped));
    const mergedReleasedArray = [];
    const unmergedReleasedArray = [];

    Object.values(grouped).forEach(group => {
        mergedReleasedArray.push(...group.releasedArray);
        unmergedReleasedArray.push(...group.unreleasedArray);
    });
    console.log(mergedReleasedArray);
    releasedArray.value = mergedReleasedArray;
    unreleasedArray.value = unmergedReleasedArray;
    return Object.values(grouped);
}

const detailsFunction = (data) => {
    console.log(data);
    sessionStorage.setItem("details", JSON.stringify(data));
    router.push({
        name: "details",
    })
}

const come = (num) => {
    console.log(num);

    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}

const timeSome = (time) => {
    return moment(time * 1000).fromNow();
}
const toFexedStake = (num) => {
    if (num) {
        return (num / 1000000000) > 1 ? (num / 1000000000).toFixed(2) : num / 1000000000;
    }
};
const stampSome = (time) => {
    return moment(time * 1000).fromNow();

}
function formatTimestamp(timestamp) {
    // const date = new Date(timestamp * 1000); // 将秒转换为毫秒
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');
    // const hour = String(date.getHours()).padStart(2, '0');

    // return `${year}-${month}-${day} ${hour}`;
    return moment(timestamp * 1000).format('YYYY-M-DD hh:mm:ss')
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
const transaction = (item) => {
    router.push({
        name: "tx",
        params: {
            item: item,
        },
    });
};

const stringcate = (str) => {
    if (str.length < 10) {
        return str;
    } else {
        return str.slice(0, 8) + "..." + str.slice(-8);
    }
};

const amountReserve = (item, boolean) => {
    if (boolean) {
        let amount = 0
        for (let i in item) {
            amount += item[i].unreleased
        }
        let num = (amount / 1000000000) > 1 ? (amount / 1000000000).toFixed(2) : amount / 1000000000;
        let reg =
            num.toString().indexOf(".") > -1
                ? /(\d)(?=(\d{3})+\.)/g
                : /(\d)(?=(\d{3})+$)/g;

        return num.toString().replace(reg, "$1,");
    } else {
        let amount = 0
        for (let i in item) {
            amount += item[i].released
        }
        let num = (amount / 1000000000) > 1 ? (amount / 1000000000).toFixed(2) : amount / 1000000000;

        let reg =
            num.toString().indexOf(".") > -1
                ? /(\d)(?=(\d{3})+\.)/g
                : /(\d)(?=(\d{3})+$)/g;

        return num.toString().replace(reg, "$1,");
        // return toFexedStake(amount);
    }
};
const chart = ref({
    height: 200,
    options: {
        chart: { type: "bar", sparkline: { enabled: true } },
        colors: [
            "rgba(" + appVariable.color.themeRgb + ", 1)",
            "rgba(" + appVariable.color.themeRgb + ", .75)",
            "rgba(" + appVariable.color.themeRgb + ", .5)",
        ],
        stroke: { show: false },
        tooltip: {
            enabled: false
        },
    },
    series: [
        {
            name: " reserve",
            data: unreleasedArray,
            color: "rgba(" + appVariable.color.themeRgb + ", 0.4)"
        },
        {
            name: "redemption",
            data: releasedArray,
            color: "rgba(" + appVariable.color.themeRgb + ", 2)"
        },
    ],
});
</script>

<style scoped>
.releasedBox {
    width: 90%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
}

.EChartsBox {
    width: 90%;
    margin: auto;
    padding: 4rem 2rem;
}
</style>