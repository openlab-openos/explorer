<template>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
        <tbody>
            <tr>
                <th style="width: 70%;">
                    {{ $t("account.transaction_signature") }}
                </th>
                <th style="width: 10%;">
                    {{ $t("blocks.title") }}
                </th>
                <th style="width: 10%;">
                    {{ $t("account.age") }}
                </th>
                <th style="width: 10%;">
                    {{ $t("account.result") }}
                </th>
            </tr>
            <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                <td class="text-theme" style="width: 70%;cursor: pointer" @click="pubbtx(item.signature)">
                    {{ item.signature }}
                </td>
                <td class="text-theme" style="width: 10%;cursor: pointer" @click="slot(item.slot)">
                    {{ come(item.slot) }}
                </td>
                <td style="width: 10%;">
                    {{ timeSome(item.blockTime) }}
                </td>
                <td style="width: 10%;">
                    {{ item.err == null ? 'Success' : 'Failed' }}
                </td>
            </tr>
        </tbody>
    </table>
    <div class="justify-end padding-10">
        <!-- <el-pagination background :hide-on-single-page="true" :page-sizes="[25]" layout="prev, pager, next" :total="historyData.length" /> -->
        <el-pagination background layout="prev, pager, next"  :hide-on-single-page="true" :current-page="currentPage"
            :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
    </div>
</template>

<script setup>
import { onMounted, ref, watchEffect,computed } from "vue";
import moment from "moment";
import { order } from "../../request/order";
import { chainRequest } from "../../request/chain";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
    url: {
        type: String,
        default: ""
    }
})
const historyData = ref([]);

const currentPage = ref(1);
const pageSize = ref(10);

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
        jsonrpc: "2.0",
        id: "",
        method: "getConfirmedSignaturesForAddress2",
        params: [props.url, { limit: 25 }],
    });
    totalItems.value = historyData.value.length;
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