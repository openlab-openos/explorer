<template>
    <card class="md-3">
        <card-body class="card-bodys">
            <div class="d-flex fw-bold small mb-3">
                <span class="flex-grow-1"> {{ $t("navigation.tokens") }} </span>
                <card-expand-toggler />
            </div>
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tbody>
                    <tr>
                        <th style=" text-align: left"> {{ $t("tokens.title") }} </th>
                        <th style=" text-align: left"> {{ $t("tokens.name") }} </th>
                        <th style=" text-align: left"> {{ $t("tokens.symbol") }} </th>
                        <th style=" text-align: left"> {{ $t("tokens.type") }}</th>
                        <th style=" text-align: left">{{ $t("tokens.owner") }}</th>
                        <!-- <th style=" text-align: left">{{ $t("tokens.lamports") }}</th>
                        <th style=" text-align: left">{{ $t("tokens.space") }}</th> -->
                        <th style=" text-align: left">{{ $t("tokens.supply") }}</th>
                    </tr>
                    <tr v-for="item, index in paginatedHistoryData" :key="index">
                        <td class="text-theme" style="cursor: pointer;"@click="pubbleys(item.pubkey)">
                            <text v-if="item.account.data.parsed.info.extensions">
                                <span v-for="(items, indexs) in item.account.data.parsed.info.extensions " :key="indexs"
                                    class="colorfff">
                                    <img v-if="items.state && items.state.uri != 'http://www.baidu.com'" :src="items.state.uri" width="32" alt="">
                                </span>
                            </text>
                            <img v-else
                                :src="item.pubkey == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz' ? 'https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png' : ''"
                                width="32" alt="">
                            <!-- B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz -->
                            {{ titleUrl(item.pubkey).url }}
                            <img v-if="titleUrl(item.pubkey).type" src="../../../src//assets//renzheng.png" width="24" alt=""> 
                        </td>
                        <td>
                            <text v-if="item.account.data.parsed.info.extensions">
                                <span v-for="(items, indexs) in item.account.data.parsed.info.extensions " :key="indexs"
                                    class="colorfff">
                                    {{ items.extension == "tokenMetadata" ? items.state.name : "" }}
                                </span>
                            </text>
                            <text v-else>
                                <span>{{ item.pubkey == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz' ? 'Native' :
                                    "N/A"
                                    }}</span>
                            </text>
                        </td>
                        <td>
                            <text v-if="item.account.data.parsed.info.extensions">
                                <span v-for="(items, indexs) in item.account.data.parsed.info.extensions " :key="indexs"
                                    class="colorfff">
                                    {{ items.extension == "tokenMetadata" ? items.state.symbol : "" }}
                                </span>
                            </text>
                            <text v-else>
                                <span>{{ item.pubkey == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz' ? 'WBTG' : "N/A"
                                    }}</span>
                            </text>
                        </td>
                        <td>
                            <!-- {{ item.account.data.parsed.type }} -->
                            VRC20
                        </td>
                        <td class="text-theme" style="cursor: pointer;" @click="pubbleys(item.account.owner)">
                            {{ titleUrl(item.account.owner).url }}
                        </td>
                        <!-- <td>
                            {{ toFexedStake(item.account.lamports) }}
                        </td>
                        <td>
                            {{ item.account.space }}
                        </td> -->
                        <template v-if="item.account.data.parsed">
                            <td>
                                {{ item.account.data.parsed.info.tokenAmount ?
                                    item.account.data.parsed.info.tokenAmount.uiAmount :
                                    toFexedStake(item.account.data.parsed.info.supply) }}
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
            <div v-if="historyData.length == 0" class="text-center">
                {{ $t("account.available") }}
            </div>
            <div class="justify-end padding-10" v-if="historyData.length != 0">
                <!-- <el-pagination background :hide-on-single-page="true" :page-sizes="[25]" layout="prev, pager, next" :total="historyData.length" /> -->
                <el-pagination background layout="prev, pager, next" :hide-on-single-page="true"
                    :current-page="currentPage" :page-size="pageSize" :total="totalItems"
                    @current-change="handlePageChange" />
            </div>
        </card-body>
    </card>
</template>
<script setup>
import { ref, computed } from 'vue'; // 假设这是在一个Vue组件中
import { tokenList } from "./tokens_request";
import { titleUrl } from "../../components/method/title_url"
import { useRouter } from "vue-router";
const router = useRouter();

const historyData = ref([]);
const currentPage = ref(1);
const pageSize = ref(30);
const totalItems = ref(0);

const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return historyData.value.slice(start, end);
});
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

tokenList().then((data) => {
    console.log(data);
    historyData.value = data;
    totalItems.value = data.length;
}).catch(error => {
    console.error('Failed to fetch token list:', error);
});
const toFexedStake = (num) => {
    if (num === undefined || num === null) {
        return null; // 或者您可以选择返回其他默认值
    }

    const value = num / 1000000000;
    const integerPart = Math.trunc(value);

    if (integerPart > 0) {
        return value.toFixed(2);
    } else {
        return value.toFixed(5);
    }
};
const pubbleys = (url) => {
    if (url) {
        router.push({
            name: "address",
            params: {
                url: url,
            },
        })
    }

};
</script>