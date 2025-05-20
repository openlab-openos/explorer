<template>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
        <tbody>
            <tr>
                <th>
                    {{ $t("account.transaction_signature") }}
                </th>
                <th>
                    {{ $t("blocks.title") }}
                </th>
                <th>
                    {{ $t("account.result") }}
                </th>
                <th>
                    {{ $t("account.age") }}
                </th>

            </tr>
            <template v-if="loading">
                <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                    <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.signature)">
                        {{ item.signature }}
                    </td>
                    <td class="text-theme" style="cursor: pointer" @click="slot(item.slot)">
                        {{ come(item.slot) }}
                    </td>
                    <td :class="item.err == null ? 'color0-255-179-1' : ''">
                        {{ item.err == null ? 'Success' : 'Failed' }}
                    </td>
                    <td>
                        {{ timeSome(item.blockTime) }}
                    </td>

                </tr>
            </template>
        </tbody>
    </table>
    <div v-if="!loading" class="text-center">
        <loading-vue />
    </div>
    <div v-if="historyData.length == 0 && loading" class="text-center">
        {{ $t("account.available") }}
    </div>
    <div class="justify-end padding-10" v-if="historyData.length != 0">
        <!-- <el-pagination background :hide-on-single-page="true" :page-sizes="[25]" layout="prev, pager, next" :total="historyData.length" /> -->
        <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
            :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
    </div>
</template>

<script setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import moment from "moment";
import { order } from "../../request/order";
import { chainRequest } from "../../request/chain";
import { useRouter } from "vue-router";
import LoadingVue from "../../components/block/loading.vue"

const router = useRouter();
const props = defineProps({
    url: {
        type: String,
        default: ""
    }
})
const loading = ref(false);
const historyData = ref([]);

const currentPage = ref(1);
const pageSize = ref(20);

const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;


    return historyData.value.slice(start, end);
});
const requestType = ref("false")
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
        jsonrpc: "2.0",
        id: "",
        method: "getConfirmedSignaturesForAddress2",
        params: [props.url, { limit: 200 }],
    });
    if (historyData.value) {
        totalItems.value = historyData.value.length;
    } else {
        historyData.value = [];
    }
    loading.value = true;
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

const pubbtx = (item) => {
    router.push({
        name: "tx",
        params: {
            item: item,
        },
    });
};



</script>