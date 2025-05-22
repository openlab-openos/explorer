<template>
    <!-- <div v-if="reserveType" >
        <div>
            {{ $t("not-been-released") }}
        </div>
        <div>
            {{ $t("have-been-released") }}
        </div>
    </div> -->
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
                <th>
                    {{ $t("mint") }}
                </th>
                <th>
                    {{ $t("account.Owner") }}
                </th>
            </tr>
            <template v-if="historyData.length != 0">
                <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                    <td>
                        <!-- {{ item.child[0].startTime }} -->
                        {{ stampSome(item.startTime) }}
                    </td>
                    <td>
                        <!-- {{ item.child[0].startTime }} -->
                        {{ stampSome(item.endTime) }}
                    </td>
                    <!-- <td>
                        {{ come(item.serial) }}
                    </td> -->
                    <td>
                        {{ item.futureCount + ' / ' + item.child.length }}
                    </td>
                    <td>
                        {{ come(item.amount) }}
                    </td>
                    <td class="text-theme" v-if="item.child" style="cursor: pointer"
                        @click="pubbtx(item.child[0].mint)">
                        {{ titleUrl(item.child[0].mint).type ? titleUrl(item.child[0].mint).url :
                            stringcate(item.child[0].mint) }}
                        <img v-if="titleUrl(item.child[0].mint).type"
                            v-for="item, index in titleUrl(item.child[0].mint).certificates" :src="item.img"
                            :key="index" width="24" alt="" class="marginRight10">
                    </td>
                    <td class="text-theme" v-if="item.child" style="cursor: pointer"
                        @click="pubbtx(item.child[0].owner)">
                        {{ titleUrl(item.child[0].owner).type ? titleUrl(item.child[0].owner).url :
                            stringcate(item.child[0].owner) }}
                        <img v-if="titleUrl(item.child[0].owner).type"
                            v-for="item, index in titleUrl(item.child[0].owner).certificates" :src="item.img"
                            :key="index" width="24" alt="" class="marginRight10">
                    </td>
                    <!-- <td v-if="item.signatures" class="text-theme" style="cursor: pointer"
                        @click="transaction(item.signatures.signature)">
                        {{ stringcate(item.signatures.signature) }}

                    </td>
                    <td v-else>N/A</td>
                    <td>
                        <span v-if="item.signatures">{{ come(item.signatures.slot) }}</span>
                        <span v-else>N/A</span>
                    </td>
                    <td class="text-theme" v-if="item.metadata" style="cursor: pointer"
                        @click="pubbtx(item.metadata.owner)">
                        {{ titleUrl(item.metadata.owner).url }}
                        <img v-if="titleUrl(item.metadata.owner).type"
                            v-for="item, index in titleUrl(item.metadata.owner).certificates" :src="item.img"
                            :key="index" width="24" alt="" class="marginRight10">
                    </td>
                    <td v-else>N/A</td>
                    <td>
                        {{ come(item.account.lamports) }}
                    </td>
                    <td v-if="item.metadata"
                        :style="item.metadata.isUnlocked ? 'color:rgba(60,210,165,1)' : 'color:rgba(225,250,7,1)'">
                        <text>{{ item.metadata.isUnlocked }}</text>


                    </td>
                    <td v-else>N/A</td>

                    <td>
                        <span v-if="item.signaturesType">{{ timeSome(item.signatures.blockTime) }}</span>
                        <span v-else>N/A</span>
                    </td> -->
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
const historyData = ref([]);
const proportion_amount = ref(0);
const currentPage = ref(1);
const pageSize = ref(25);
const url = ref(props.url);
const paramsId = ref(props.paramsId);
const reserveType = ref(props.type);


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
        // let getSignaturesForAddress = {
        //     "jsonrpc": "2.0",
        //     "id": 1,
        //     "method": "getSignaturesForAddress",
        //     "params": [
        //         historyData.value[i].pubkey,
        //         {
        //             "limit": 1
        //         }
        //     ]
        // }

        // await requestList(getSignaturesForAddress).then(res => {

        //     historyData.value[i].signatures = res[0];
        //     historyData.value[i].signaturesType = true;
        // }).catch(err => {
        //     console.log(err);

        //     historyData.value[i].signatures = {};
        //     historyData.value[i].signaturesType = false;
        // });
        // console.log(parseNFTMetadataData);
    }
    // console.log(historyData.value);
    historyData.value = groupBySerialNumber(data);
    console.log(historyData.value);

    totalItems.value = historyData.value.length;

});

// function groupBySerialNumber(arr) {
//     const grouped = {};
//     arr.forEach(item => {
//         const key = item.metadata.serialNumber;
//         if (!grouped[key]) {
//             grouped[key] = {
//                 serial: key,
//                 startTime: item.metadata.startTime,
//                 child: [],
//                 amount: 0 // 初始化amount字段
//             };
//         }
//         grouped[key].child.push(item.metadata);
//         // 将当前item的amount转换为数字并累加到总和中
//         grouped[key].amount += parseFloat(item.metadata.amount) || 0;
//     });
//     return Object.values(grouped);
// }

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
                futureCount: 0 // 初始化未来时间数量
            };
        }
        grouped[key].child.push(item.metadata);
        grouped[key].amount += parseFloat(item.metadata.amount) || 0;

        // 统计child中endTime大于当前时间的数量
        const currentTime = Math.floor(Date.now());
        if (parseInt(item.metadata.endTime, 10) > currentTime) {
            grouped[key].futureCount++;
        }
    });

    return Object.values(grouped);
}


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

const stampSome = (time) => {
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
</script>