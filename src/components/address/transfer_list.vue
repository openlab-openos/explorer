<template>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
        <tbody>
            <tr>
                <th>
                    {{ $t("account.signature") }}
                </th>

                <th>
                    {{ $t("account.primary") }}
                </th>
                <th>
                    {{ $t("account.quantity") }}
                </th>
                <th>
                    {{ $t("account.destination") }}
                </th>

                <th>
                    {{ $t("account.Political") }}
                </th>
                <th>
                    {{ $t("account.movement") }}
                </th>
                <th>
                    {{ $t("account.time") }}
                </th>
            </tr>
            <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.result.transaction.signatures[0])">
                    {{ stringcate(item.result.transaction.signatures[0]) }}
                </td>
                <td style=" text-align: left; cursor: pointer" class="text-theme"
                    @click="slot(item.result.transaction.message.instructions[0].parsed.info.source)">
                    {{ item.result.transaction.message.instructions[0].parsed.info.source }}
                </td>
                <td style=" text-align: left; cursor: pointer" class="text-theme"
                    @click="slot(item.result.transaction.message.instructions[0].parsed.info.destination)">
                    {{ item.result.transaction.message.instructions[0].parsed.info.destination }}
                </td>
                <td>
                    {{
                        item.result.transaction.message.instructions[0]
                            .parsed.info.mint ? item.result.transaction.message.instructions[0]
                                .parsed.info.tokenAmount.uiAmount : toFexedStake(
                                    item.result.transaction.message.instructions[0].parsed
                                        .info.lamports
                                )
                    }}
                </td>

                <td>
                    {{
                        stringcate(
                            item.result.transaction.message.instructions[0]
                                .parsed.info.mint ? item.result.transaction.message.instructions[0]
                                    .parsed.info.mint : "BTG"
                        )
                    }}
                </td>
                <td>
                    <button type="button" style="
                      height: 20px;
                      padding: 0;
                      padding: 0px 8px;
                      border: 1px solid #3cd2a5;
                      background-color: #212b38;
                      color: #3cd2a5;
                      border-radius: 2px;
                      line-height: 18px;
                      text-align: center;
                      cursor: auto;">
                        {{
                            textValue(
                                item.result.transaction.message.instructions[0]
                                    .parsed.type == "transfer" ? "Transfer" : "token_transfer"
                            )
                        }}
                    </button>
                </td>
                <td class="text-theme" style="cursor: pointer">
                    <!-- {{ come(item.slot) }} -->
                    {{ timeSome(item.result.blockTime) }}

                </td>
            </tr>
        </tbody>
    </table>
    <div class="justify-end padding-10">
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
import { solanapubbleys } from "../method/solana"
const router = useRouter();
const props = defineProps({
    url: {
        type: String,
        default: ""
    }
})
const historyData = ref([]);

const currentPage = ref(1);
const pageSize = ref(20);

const paginatedHistoryData = computed(() => {
    if (historyData.value.length > 0) {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return historyData.value.slice(start, end);
    }
});

const totalItems = ref(0);

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};
const toFexedStake = (num) => {
    if (num) {
        return JSON.parse((num / 1000000000).toFixed(2));
    }
};
const requestList = async (object) => {
    try {
        const response = await order(object);
        // 解析和处理返回的数据
        console.log(response);
        return response; // 现在这个函数会返回解析后的数据
    } catch (error) {
        console.error("Error fetching epoch info:", error);
        return []; // 返回一个空数组或抛出错误取决于你的需求
    }
}


onMounted(async () => {
    historyData.value = await requestList(props.url);
     totalItems.value = historyData.value.length;
});
const textValue = (text) => {
    return text.toUpperCase();
};
const pubbtx = (item) => {
    router.push({
        name: "tx",
        params: {
            item: item,
        },
    });
};

const slot = (url) => {
    solanapubbleys(url, router)
};
const stringcate = (str) => {
    if (str.length < 10) {
        return str;
    } else {
        return str.slice(0, 15) + "...";
    }
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



</script>