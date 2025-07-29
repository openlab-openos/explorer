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
                            <th style=" text-align: left"> {{ $t("protocol") }}</th>
                            <th style=" text-align: left"> {{ $t("holders") }}</th>
                            <th style=" text-align: left"> {{ $t("market_cap") }} </th>
                            <th style=" text-align: left"> {{ $t("price") }}</th>
                        </tr>
                        <template v-if="type">
                            <tr v-for="item, index in paginatedHistoryData" :key="index">
                                <td class="text-theme">
                                    <img v-if="item.token.image_url" :src="item.token.image_url" height="24" alt=""
                                        class="marginRight8">
                                    <img v-if="B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz"
                                        :src="item.token.pubkey == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz' ? 'https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png' : ''"
                                        width="32" alt="" class="marginRight8">

                                    <text style="cursor: pointer;" @click="pubbleys(item.token.address)">{{
                                        titleUrl(item.token.address).url }}</text>
                                    <img v-if="titleUrl(item.token.pubkey).type"
                                        v-for="(datas, indexs) in titleUrl(item.token.pubkey).certificates"
                                        :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                                </td>
                                <td>
                                    {{ item.token.symbol }}
                                </td>

                                <template v-if="item.token.certificates.length == 0">
                                    <td>N/A</td>
                                </template>
                                <template v-else>
                                    <td>
                                        <img v-for="items, indexs in item.token.certificates" :key="indexs"
                                            :src="items.image_url" height="24" class="marginRight8"
                                            :title="items.certificate_code" @click="pubbley" style="cursor: pointer;">
                                        <!-- <div style="display: flex;">
                                        <p v-for="items, indexs in item.token.certificates" :key="indexs"
                                            :style="'background-color: ' + items.backColor"
                                            style="border-radius: 5px;padding: 2px 4px;margin-right: 5px;margin-bottom: 0;font-weight: 500;">
                                            {{ items.certificate_code }}
                                        </p>
                                    </div> -->
                                    </td>
                                </template>


                                <!-- <td>
                                {{ item.token.symbol }}
                            </td> -->
                                <td>
                                    {{ item.token.protocol_code ? item.token.protocol_code : 'N/A' }}
                                </td>
                                <td>
                                    {{ item.token.holders }}
                                </td>
                                <td>
                                    $ {{ come(item.token.market_cap) }}
                                </td>
                                <td>
                                    {{ item.token.price ? '$' : '' }} {{ item.price ? item.price : item.token.price }}
                                    <img v-if="item.token.price_icon" :src="imgUrl + '/' + item.token.price_icon"
                                        height="24" class="marginRight8" alt="">
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
        <PROGRAMVIEW />
    </div>
    <div v-else>
        <loading-vue />
    </div>
</template>
<script setup>
import {
    computed,
    // defineAsyncComponent,
    ref,
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
import { tokenList } from './asset';
import PROGRAMVIEW from "./componects/ProgramList.vue"

const loadingType = ref(false);
const router = useRouter();
const imgUrl = ref('https://open.openverse.live');
const dataArray = ref()
const historyData = ref([]);
const currentPage = ref(1);
const pageSize = ref(30);
const totalItems = ref(0);
const loading = ref(false);
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    // console.log(historyData.value);
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
tokenList().then((res) => {


    const showData = res.data;

    dataArray.value = showData;
    // console.log(showData);

    // console.log(showData);
    for (const i in showData) {
        if (showData[i].token) {
            for (const j in showData[i].token.certificates) {
                switch (showData[i].token.certificates[j].certificate_code) {
                    case 'Official':
                        showData[i].token.certificates[j].backColor = '#229cF2'
                        break;
                    case 'Unknown':
                        showData[i].token.certificates[j].backColor = '#d4d6d7'
                        break;
                    case 'Unsafe':
                        showData[i].token.certificates[j].backColor = '#F61414'
                        break;
                    case 'VRC10':
                        showData[i].token.certificates[j].backColor = '#ffa06f'
                        break;
                    case 'VRC11':
                        showData[i].token.certificates[j].backColor = '#ffa06f'
                        break;
                    case 'VRC12':
                        showData[i].token.certificates[j].backColor = '#ffa06f'
                        break;
                    case "USDStableCoin":
                        showData[i].token.certificates[j].certificate_code = 'Stablecoin'
                        showData[i].token.certificates[j].backColor = '#5ba556'
                        break;
                    case "Stablecoin":
                        showData[i].token.certificates[j].backColor = '#5ba556'
                        break;
                }
            }
        }
    }
    const array = [];
    for (const i in showData) {
        if (showData[i].token) {
            array.push(showData[i])
        }
    }
    historyData.value = array;
    totalItems.value = array.length;
    loading.value = true;
}).catch(error => {
    loadingType.value = true;
    console.error('Failed to fetch token list:', error);
});
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
const come = (num) => {
    const reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}
</script>