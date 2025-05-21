<template>
    <div>

    </div>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small" v-if="!loading">
        <tbody>
            <tr>
                <th>
                    {{ $t("account.mint_account") }}
                </th>
                <th>
                    {{ $t("blocks.slot") }}
                </th>
                <!-- <th>
                    {{ $t("account.owner") }}
                </th> -->
                <th>
                    {{ $t("account.pubkey") }}
                </th>
                <th>
                    {{ $t("account.lamports") }}
                </th>
                <th>
                    {{ $t("account.executable") }}
                </th>
                <th>
                    {{ $t("account.age") }}
                </th>
            </tr>
            <template v-if="historyData.length != 0">
                <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                    <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.metadata.mint)"
                        v-if="item.metadataType">
                        {{ titleUrl(item.metadata.mint).url }}
                        <img v-if="titleUrl(item.metadata.mint).type"
                            v-for="item, index in titleUrl(item.metadata.mint).certificates" :src="item.img"
                            :key="index" width="24" alt="" class="marginRight10">
                    </td>
                    <td class="text-theme" style="cursor: pointer" v-else>N/A </td>
                    <td>
                        <span v-if="item.signaturesType">{{ come(item.signatures.slot) }}</span>
                        <span v-else>N/A</span>
                    </td>
                    <!-- <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.account.owner)">
                        {{ titleUrl(item.account.owner).url }}
                        <img v-if="titleUrl(item.account.owner).type"
                            v-for="item, index in titleUrl(item.account.owner).certificates" :src="item.img"
                            :key="index" width="24" alt="" class="marginRight10">
                    </td> -->
                    <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.pubkey)">
                        {{ titleUrl(item.pubkey).url }}
                        <img v-if="titleUrl(item.pubkey).type" v-for="item, index in titleUrl(item.pubkey).certificates"
                            :src="item.img" :key="index" width="24" alt="" class="marginRight10">
                    </td>
                    <td>
                        {{ come(item.account.lamports) }}
                    </td>
                    <td :style="item.account.executable ? 'color:rgba(60,210,165,1)' : 'color:rgba(225,250,7,1)'">
                        {{ item.account.executable }}
                    </td>
                    <td>
                        <span v-if="item.signaturesType">{{ timeSome(item.signatures.blockTime) }}</span>
                        <span v-else></span>
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
import { parseNFTMetadata } from "../../request/reserve"
import { titleUrl } from "../method/title_url"
import LoadingVue from "../../components/block/loading.vue"
import { solanagetAccount } from "../../request/solanaGetaccount";
import { lo } from "element-plus/es/locale/index.mjs";
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
console.log(parseNFTMetadata(url.value, paramsId.value));


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
    historyData.value = await requestList(
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
    console.log(historyData.value);
    for (let i = 0; i < historyData.value.length; i++) {
        await parseNFTMetadata(historyData.value[i].pubkey).then((res) => {
            console.log(res);
            historyData.value[i].metadata = res;
            historyData.value[i].metadataType = true;
        }).catch(err => {
            historyData.value[i].metadata = {};
            historyData.value[i].metadataType = false;
        });
        let getSignaturesForAddress = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getSignaturesForAddress",
            "params": [
                historyData.value[i].pubkey,
                {
                    "limit": 1
                }
            ]
        }

        await requestList(getSignaturesForAddress).then(res => {
            console.log(res);

            historyData.value[i].signatures = res[0];
            historyData.value[i].signaturesType = true;
        }).catch(err => {
            console.log(err);

            historyData.value[i].signatures = {};
            historyData.value[i].signaturesType = false;
        });
        // console.log(parseNFTMetadataData);
    }
    loading.value = false;
    // let method = {
    //     "jsonrpc": "2.0", "id": 1,
    //     "method": "getTokenSupply",
    //     "params": [
    //         // "GragM9tHgicpxtf9qrTkbY1fFZYA8CJaDgLuFnZikdqs"
    //         props.url
    //     ]
    // };
    totalItems.value = historyData.value.length;


    // proportion_amount.value = await chainRequest(method).then(res => {


    //     return res.result.value.uiAmount;
    // }).catch(err => {
    //     console.log(err);
    //     return 0;
    // });
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