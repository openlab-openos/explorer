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
                                <img v-if="item.img" :src="item.img" width="32" alt="">
                                <img v-if="item.account.data.parsed.info.mint == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'"
                                    src="https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png" width="32" alt="">
                                {{ titleUrl(item.account.data.parsed.info.mint).url }}
                                <text v-if="item.name">{{ '(' + item.name + ')' }}</text>
                                <text
                                    v-if="item.account.data.parsed.info.mint == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'">(Native)</text>
                                &nbsp;

                                <img v-if="titleUrl(item.account.data.parsed.info.mint).type" v-for="(datas,indexs) in titleUrl(item.account.data.parsed.info.mint).certificates" :key="indexs" :src="datas.img" width="16" class="marginRight8" alt="">

                            </td>
                            <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.pubkey)">
                                {{ titleUrl(item.pubkey).url }} 
                                <img v-if="titleUrl(item.pubkey).type" v-for="(datas,indexs) in titleUrl(item.pubkey).certificates" :key="indexs" :src="datas.img" width="16" class="marginRight8" alt="">

                            </td>

                            <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.account.owner)">
                                {{ titleUrl(item.account.owner).url }} 
                                <img v-if="titleUrl(item.account.owner).type" v-for="(datas,indexs) in titleUrl(item.account.owner).certificates" :key="indexs" :src="datas.img" width="16" class="marginRight8" alt="">
                                
                            </td>
                            <td>
                                {{ titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).url }} 
                                <img v-if="titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).type" v-for="(datas,indexs) in titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).certificates" :key="indexs" :src="datas.img" width="16" class="marginRight8" alt="">
                                    <text v-if="item.symbol"> {{ '(' + item.symbol + ')' }}</text>
                                    <text
                                    v-if="titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).symbol">({{ titleUrl(item.account.data.parsed.info.tokenAmount.uiAmount).symbol }})</text>
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
import { ref, computed, onMounted } from 'vue';
import { titleUrl } from "../../components/method/title_url"
import { useRouter } from "vue-router";
import { chainRequest } from "../../request/chain";

const router = useRouter();
const props = defineProps({
    tokens: Array,
});
console.log(props.tokens);
const data = ref(props.tokens);
const currentPage = ref(1);
const pageSize = ref(20);
const tokenData = ref();
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return props.tokens.slice(start, end);
});
const tokenList = async () => {
    let method = {
        jsonrpc: "2.0",
        id: 1,
        method: "getProgramAccounts",
        params: [
            "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
            {
                encoding: "jsonParsed",
                filters: [
                    {
                        "memcmp": {
                            "offset": 1,
                            "bytes": "1"
                        },
                    }
                ]
            }
        ]
    };
    try {
        const res = await chainRequest(method);
        console.log(res);
        tokenData.value = res.result;
        return res.result;
    } catch (err) {
        console.error(`Error fetching accounts for ${token}:`, err);
        return [];
    }
}
onMounted(async () => {
    await tokenList();
    console.log(data.value);

    console.log(tokenData.value);
    if (tokenData.value) {
        for (let i in tokenData.value) {
            console.log(11);
            for (let j in data.value) {
                if (tokenData.value[i].pubkey == data.value[j].account.data.parsed.info.mint) {
                    console.log(j);
                    console.log(i);
                    console.log(tokenData.value[i].account.data.parsed.info.extensions);

                    if (tokenData.value[i].account.data.parsed.info.extensions) {
                        console.log('11111');

                        for (let a in tokenData.value[i].account.data.parsed.info.extensions) {
                            if (tokenData.value[i].account.data.parsed.info.extensions[a].extension == "tokenMetadata") {
                                console.log(a);
                                console.log(5555);
                                console.log(tokenData.value[i].account.data.parsed.info.extensions[a].state.uri);

                                data.value[j].img = tokenData.value[i].account.data.parsed.info.extensions[a].state.uri;
                                data.value[j].name = tokenData.value[i].account.data.parsed.info.extensions[a].state.name;
                                data.value[j].symbol = tokenData.value[i].account.data.parsed.info.extensions[a].state.symbol;

                            }
                        }
                    }
                }
            }
        }
    }
})
const pubbtx = (item) => {
    router.push({
        name: "address",
        params: {
            url: item,
        },
    });
};
</script>