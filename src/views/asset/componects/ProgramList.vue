<template>
    <div v-if="loadingType">
        <!-- <card class="md-3"> -->
            <!-- <card-body class="card-bodys">
                <div class="d-flex fw-bold small mb-3">
                    <span class="flex-grow-1"> {{ $t("navigation.tokens") }} </span>
                </div> -->
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <tbody>
                        <tr>
                            <th style=" text-align: left"> {{ $t("tokens.title") }} </th>
                            <th style=" text-align: left"> {{ $t("tokens.symbol") }} </th>
                            <th style=" text-align: left">{{ $t('certificates') }}</th>
                            <th style=" text-align: left"> {{ $t("holders") }}</th>
                            <th style=" text-align: left"> {{ $t("market_cap") }} </th>
                            <th style=" text-align: left"> {{ $t("price") }}</th>
                            <th style="text-align: left"> {{ $t("dashboard.supply") }}</th>
                            <th style="text-align: left"> {{ $t("exchange") }}</th>
                        </tr>
                        <template v-if="type">
                            <tr v-for="item, index in paginatedHistoryData" :key="index">
                                <td class="text-theme">
                                    <img v-if="item.image_url" :src="item.image_url" alt=""
                                        class="marginRight8 imgCenter">
                                    <img v-if="item.address == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'"
                                        :src="item.address == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz' ? 'https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png' : ''"
                                        width="20" alt="" class="marginRight8">
                                    <router-link :to="{ name: 'address', params: { url: item.address, } }">{{
                                        item.name ? item.name :stringcate(item.address) }}</router-link>

                                    <img v-if="titleUrl(item.pubkey).type"
                                        v-for="(datas, indexs) in titleUrl(item.pubkey).certificates" :key="indexs"
                                        :src="datas.img" height="20" class="marginRight8" alt="">
                                </td>
                                <td>
                                    {{ item.symbol ? item.symbol : (titleUrl(item.address).symbol ?
                                        titleUrl(item.address).symbol : 'N/A' ) }}
                                </td>

                                <template
                                    v-if="item.certificates.length == 0 && item.address != 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'">
                                    <td>N/A</td>
                                </template>
                                <template v-else>
                                    <td>
                                        <img v-for="items, indexs in item.certificates" :key="indexs"
                                            :src="items.image_url" height="20" class="marginRight8"
                                            :title="items.certificate_code" @click="pubbley"
                                            style="cursor: pointer;">
                                        </img>
                                    </td>
                                </template>
                                <td>
                                    <!-- {{ item.token_all[0] }} -->
                                    {{ item ? come(item.holders) : 0 }}
                                </td>
                                <td>
                                    $ {{ come(smartFormatNumber(item.market_value)) }}
                                </td>
                                <td>
                                    $ {{ come(smartFormatNumber(item.price ? item.price : '0')) }}
                                    <img v-if="item.price_icon" :src="imgUrl + '/' + item.price_icon" height="24"
                                        class="marginRight8" alt="">
                                </td>
                                <td>
                                    {{ come(smartFormatNumber(item.supply)) }}
                                </td>
                                <td>
                                    <a class="a-Link" id="buyD" v-if="item.price_source == 'OpenSwap'"
                                        :href="`https://openswap.me//swap/?lang=zh_CN&inputMint=USDTWFmHW5ieSiQM7ea4fPPdx3a5zMEgp1yqgRqjZdt&outputMint=${item.address}`"
                                        target="_blank">
                                        <text class="textD backStyle">D</text> Buy
                                    </a>
                                    <a class="a-Link" id="buyC" v-if="item.price_source == 'Bitcoin_TM'"
                                        :href="`https://www.vasdaq.com`"
                                        target="_blank">
                                        <text class="textC backStyle">C</text> Buy
                                    </a>
                                    <a v-if="item.price_source == 'Constant'"
                                        :href="`http://localhost:3109/swap/?lang=zh_CN&outputMint= ${item.address} `"
                                        target="_blank">
                                    </a>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <!-- <div v-if="!loading" class="text-center">
                    <loading-vue v-if="true" />
                </div> -->
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
            <!-- </card-body> -->
        <!-- </card> -->
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

import LoadingVue from '../../../components/block/loading.vue';
import { titleUrl } from '../../../components/method/title_url';
import { smartFormatNumber } from '../../../components/number/smart';

const props = defineProps({
  data:{
    type:Array,
    default:[]
  }
})
console.log(props.data);

const loadingType = ref(false);
const router = useRouter();
const imgUrl = ref('https://open.openverse.live');
const dataArray = ref()
const historyData = ref(props.data);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(props.data.length);
const loading = ref(false);
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return historyData.value.slice(start, end);
});
// console.log('paginatedHistoryData',paginatedHistoryData);

const type = ref(true);
const handlePageChange = (newPage) => {
    type.value = false;
    currentPage.value = newPage;
    setTimeout(() => {
        type.value = true;
    }, 1);
};

const stringcate = (str) => {
  if (str) {
    if (str.length < 10) {
      return str;
    } else {
      return str.slice(0, 5) + "..." + str.slice(-5);
    }
  } else {
    return "BTG";
  }
};
const pubbley = () => {
    router.push({
        name: "TokenReputation",
    })
};
loadingType.value = true;

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

<style scoped>
a {
    text-decoration: none
}

#buyD {
    color: rgba(0, 255, 179, 1);

}

#buyC {
    color: rgba(255, 215, 39, 1);

}

.backStyle {
    background: rgba(255, 255, 255, 0.2);
    padding: 3px 6px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 14px;
    margin-right: 3px;
}

.a-Link {
    margin-left: 1px;
    margin-bottom: 1px;
    font-family: Gilroy;
}
</style>