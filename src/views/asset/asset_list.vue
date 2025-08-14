<template>
    <div v-if="loadingType">
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
                            <th style=" text-align: left"> {{ $t("tokens.symbol") }} </th>
                            <th style=" text-align: left">{{ $t('certificates') }}</th>

                            <!-- <th style=" text-align: left"> {{ $t("tokens.symbol") }} </th> -->
                            <!-- <th style=" text-align: left"> {{ $t("protocol") }}</th> -->
                            <th style=" text-align: left"> {{ $t("holders") }}</th>
                            <th style=" text-align: left"> {{ $t("market_cap") }} </th>
                            <th style=" text-align: left"> {{ $t("price") }}</th>
                            <th style="text-align: left"> {{ $t("dashboard.supply") }}</th>
                        </tr>
                        <template v-if="type">
                            <tr v-for="item, index in paginatedHistoryData" :key="index">
                                <td class="text-theme">
                                    <img v-if="item.image_url" :src="item.image_url" height="20" alt=""
                                        class="marginRight8 imgCenter">
                                    <img v-if="B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz"
                                        :src="item.pubkey == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz' ? 'https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png' : ''"
                                        width="20" alt="" class="marginRight8">

                                    <text style="cursor: pointer;" @click="pubbleys(item.address)">{{
                                        item.name ? item.name : item.address }}</text>
                                    <img v-if="titleUrl(item.pubkey).type"
                                        v-for="(datas, indexs) in titleUrl(item.pubkey).certificates" :key="indexs"
                                        :src="datas.img" height="20" class="marginRight8" alt="">
                                </td>
                                <td>
                                    {{ item.symbol ? item.symbol : 'N/A' }}
                                </td>

                                <template v-if="item.certificates.length == 0">
                                    <td>N/A</td>
                                </template>
                                <template v-else>
                                    <td>
                                        <img v-for="items, indexs in item.certificates" :key="indexs"
                                            :src="items.image_url" height="20" class="marginRight8"
                                            :title="items.certificate_code" @click="pubbley" style="cursor: pointer;">
                                        <!-- <div style="display: flex;">
                                        <p v-for="items, indexs in item.certificates" :key="indexs"
                                            :style="'background-color: ' + items.backColor"
                                            style="border-radius: 5px;padding: 2px 4px;margin-right: 5px;margin-bottom: 0;font-weight: 500;">
                                            {{ items.certificate_code }}
                                        </p>
                                    </div> -->
                                    </td>
                                </template>


                                <!-- <td>
                                {{ item.symbol }}
                            </td> -->
                                <!-- <td>
                                    {{ item.protocol_code ? item.protocol_code : 'N/A' }}
                                </td> -->
                                <td>
                                    <!-- {{ item.token_all[0] }} -->
                                    {{ item ? item.holders : 0 }}
                                </td>
                                <td>
                                    $ {{ come(smartFormatNumber( toFexedStake(item.market_value,item.decimals)))  }}
                                </td>
                                <td>
                                    {{ item.price ? '$' : '' }} 
                                    {{ come(smartFormatNumber(item.price ? item.price : '0'))  }}
                                    <img v-if="item.price_icon" :src="imgUrl + '/' + item.price_icon" height="24"
                                        class="marginRight8" alt="">
                                </td>
                                <td>
                                    {{ come(smartFormatNumber(toFexedStake(item.supply, item.decimals))) }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div v-if="!loading" class="text-center">
                    <loading-vue v-if="true" />
                </div>
                <div v-if="historyData.length == 0 && loading" class="text-center">
                    {{ $t("account.available") }}
                </div>
                <template v-if="historyData.length > 10">
                    <div class="justify-end padding-10">
                        <el-pagination background layout="prev, pager, next" :hide-on-single-page="false"
                            :current-page="currentPage" :page-size="pageSize" :total="totalItems"
                            @current-change="handlePageChange" />
                    </div>
                </template>
            </card-body>
        </card>
        <!-- <PROGRAMVIEW /> -->
    </div>
    <div v-else>
        <loading-vue />
    </div>
</template>
<script setup>
import {
  computed,
  ref,
  watchEffect,
} from 'vue'; // 假设这是在一个Vue组件中

import { useRouter } from 'vue-router';

// import stable from '../../assets/assetsLogo/stable.png';
// import unknown from '../../assets/assetsLogo/unknown.png';
// import unsafe from '../../assets/assetsLogo/unsafe.png';
// import vrc10 from '../../assets/assetsLogo/vrc10.png';
// import vrc11 from '../../assets/assetsLogo/vrc11.png';
// import vrc12 from '../../assets/assetsLogo/vrc12.png';
// import vrc20 from '../../assets/assetsLogo/vrc20.png';
import LoadingVue from '../../components/block/loading.vue';
import { titleUrl } from '../../components/method/title_url';
import { smartFormatNumber } from '../../components/number/smart';
import { tokenList } from './asset';
// import PROGRAMVIEW from "./componects/ProgramList.vue"
import { tokenList as tokenProgram } from './componects/Program.js';

const loadingType = ref(false);
const router = useRouter();
const imgUrl = ref('https://open.openverse.live');
const dataArray = ref()
const historyData = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const loading = ref(false);
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    console.log(historyData.value);
    return historyData.value.slice(start, end);
});
const type = ref(true);
const handlePageChange = (newPage) => {
    type.value = false;
    currentPage.value = newPage;
    setTimeout(() => {
        type.value = true;
    }, 1);
};
watchEffect(async () => {
    try {
        const assets = await tokenList(1);
        // const res = await tokenProgram(1);
        console.log('assets', assets);
        
        // const uniqueArray = [...combined,...combined,...combined]
        // console.log(uniqueArray);
        historyData.value = assets.data;
        totalItems.value =assets.data.length;
        loading.value = true;
    } catch (error) {
        console.error('Error in watchEffect:', error);
    }
});
// tokenList().then((res) => {
//     console.log(res);
//     const showData = res;
//     dataArray.value = showData;
//     historyData.value = showData;
//     totalItems.value = showData.length;
//     loading.value = true;
// }).catch(error => {
//     loadingType.value = true;
//     console.error('Failed to fetch token list:', error);
// });
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
const pubbley = () => {
    router.push({
        name: "TokenReputation",
    })
};
loadingType.value = true;

// const imageType = (type) => {
//     switch (type) {
//         case 'unknown':
//             return unknown
//         case 'stable':
//             return stable
//         case 'unsafe':
//             return unsafe
//         case 'vrc10':
//             return vrc10
//         case 'vrc11':
//             return vrc11
//         case 'vrc12':
//             return vrc12
//         case 'vrc20':
//             return vrc20
//     }
// }
const toFexedStake = (num, decimals) => {
    if (num == null || decimals == null) {
        console.error('Number and decimals must be provided.');
        return 0;
    }
    const divisor = Math.pow(10, JSON.parse(decimals));

    return (JSON.parse(num) / divisor).toFixed(2);;

};
const come = (num) => {
    if (num) {
        const reg =
            num.toString().indexOf(".") > -1
                ? /(\d)(?=(\d{3})+\.)/g
                : /(\d)(?=(\d{3})+$)/g;

        return num.toString().replace(reg, "$1,");
    }
}
</script>