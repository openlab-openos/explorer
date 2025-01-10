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
                    <template v-if="tokens.length != 0">
                        <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                            <td class="text-theme" style="cursor: pointer"
                                @click="pubbtx(item.account.data.parsed.info.mint)">
                                {{ titleUrl(item.account.data.parsed.info.mint).url }}  <img v-if="titleUrl(item.account.data.parsed.info.mint).type" src="../../../src//assets//renzheng.png" width="20" alt="">
                            </td>
                            <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.pubkey)">
                                {{ titleUrl(item.pubkey).url }}   <img v-if="titleUrl(item.pubkey).type" src="../../../src//assets//renzheng.png" width="20" alt="">
                            </td>

                            <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.account.owner)">
                                {{ titleUrl(item.account.owner).url }} <img v-if="titleUrl(item.account.owner).type" src="../../../src//assets//renzheng.png" width="20" alt="">
                            </td>
                            <td>
                                {{ titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).url }} <img v-if="titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).type" src="../../../src//assets//renzheng.png" width="20" alt="">
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
            <!-- <el-pagination background :hide-on-single-page="true" :page-sizes="[25]" layout="prev, pager, next" :total="historyData.length" /> -->
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
                :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
        </div>
    </card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { titleUrl } from "../../components/method/title_url"
import { useRouter } from "vue-router"
const router = useRouter();
const props = defineProps({
    tokens: Array,
});

const currentPage = ref(1);
const pageSize = ref(20);

const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return props.tokens.slice(start, end);
});
const pubbtx = (item) => {
    router.push({
        name: "address",
        params: {
            url: item,
        },
    });
};
</script>