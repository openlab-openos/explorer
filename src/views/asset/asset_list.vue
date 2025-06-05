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
                        <tr v-for="item, index in paginatedHistoryData" :key="index">
                            <td class="text-theme" style="cursor: pointer;" @click="pubbleys(item.address)">
                                <img v-if="item.image_url" :src="item.image_url" height="24" alt=""
                                    class="marginRight8">
                                <img v-if="B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz"
                                    :src="item.pubkey == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz' ? 'https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png' : ''"
                                    width="32" alt="" class="marginRight8">
                                {{ titleUrl(item.address).url }}
                                <!-- <img v-if="titleUrl(item.pubkey).type" src="../../../src//assets//renzheng.png"
                                    height="24" alt=""> -->
                                <img v-if="titleUrl(item.pubkey).type"
                                    v-for="(datas, indexs) in titleUrl(item.pubkey).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                            </td>
                            <td>
                                {{ item.symbol }}
                            </td>
                            <template v-if="item.certificates.length == 0">
                                <td>N/A</td>
                            </template>
                            <template v-else>
                                <td>
                                    <img v-for="items, indexs in item.certificates" :key="indexs"
                                        :src="items.image_url" height="20" class="marginRight8"
                                        :title="items.certificate_code">
                                </td>
                            </template>


                            <!-- <td>
                                {{ item.symbol }}
                            </td> -->
                            <td>
                                {{ item.protocol_code ? item.protocol_code : 'N/A' }}
                            </td>
                            <td>
                                {{ item.holders }}
                            </td>
                            <td>
                               $ {{ item.market_cap }}
                            </td>
                            <td>
                                {{ item.price ? '$' : '' }} {{ item.price ? item.price : 'N/A' }} 
                                <img v-if="item.price_icon" :src="imgUrl + '/' + item.price_icon" height="24"
                                    class="marginRight8" alt="">
                            </td>
                        </tr>
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
                        <el-pagination background layout="prev, pager, next" :hide-on-single-page="true"
                            :current-page="currentPage" :page-size="pageSize" :total="totalItems"
                            @current-change="handlePageChange" />
                    </div>
                </template>
            </card-body>
        </card>
    </div>
    <div v-else>
        <loading-vue />
    </div>
</template>
<script setup>
import {
  computed,
  defineAsyncComponent,
  ref,
} from 'vue'; // 假设这是在一个Vue组件中

import { useRouter } from 'vue-router';

import stable from '../../assets/assetsLogo/stable.png';
import unknown from '../../assets/assetsLogo/unknown.png';
import unsafe from '../../assets/assetsLogo/unsafe.png';
import vrc10 from '../../assets/assetsLogo/vrc10.png';
import vrc11 from '../../assets/assetsLogo/vrc11.png';
import vrc12 from '../../assets/assetsLogo/vrc12.png';
import vrc20 from '../../assets/assetsLogo/vrc20.png';
import LoadingVue from '../../components/block/loading.vue';
import { titleUrl } from '../../components/method/title_url';
import { tokenList } from './asset';

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
    return historyData.value.slice(start, end);
});
tokenList().then((res) => {
    

    let showData = res.data.filter(item => item.is_web == 1);

    dataArray.value = showData;
    historyData.value = showData;
    totalItems.value = showData.length;
    loading.value = true;
}).catch(error => {
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
loadingType.value = true;

const imageType = (type) => {
    switch (type) {
        case 'unknown':
            return unknown
            break;
        case 'stable':
            return stable
            break;
        case 'unsafe':
            return unsafe
            break;
        case 'vrc10':
            return vrc10
            break;
        case 'vrc11':
            return vrc11
            break;
        case 'vrc12':
            return vrc12
        case 'vrc20':
            return vrc20
    }
}

</script>