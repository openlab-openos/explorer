<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t("Bitcurrency") }} </span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px; font-size: 0.9rem;line-height: 30px;">
              {{data? come(smartFormatNumber( toFexedStake(data.market_value,data.decimals))) : '0'}}
            </h5>
          </div>

          <!-- <div style="width: 40%; height: 30px">
            <div>
              <apexchart :height="charts.height" :options="charts.options" :series="charts.series"></apexchart>
            </div>
          </div> -->
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ $t(statInfo.language) }} {{ statInfo.text }}</div>
          </template>
        </div>
      </card-body>
    </card>
    <!-- END card -->
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  watchEffect,
} from 'vue';

import apexchart from '@/components/plugins/Apexcharts.vue';
import i18n from '@/i18n';
import { useAppVariableStore } from '@/stores/app-variable';

import { smartFormatNumber } from '../../components/number/smart';
import { useAppStore } from '../../stores/index';
import { tokenList } from '../../views/asset/asset.js';

const appVariable = useAppVariableStore();

const appStore = useAppStore();
const rate = ref();

const info = ref([]);

// 语言
function selectLanguage(indexValue) {
  i18n.global.locale = indexValue;
}
watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

const data = ref();

watchEffect(async () => {
    try {
        const assets = await tokenList(1,5);
        // const res = await tokenProgram(1);
        console.log('assets', assets);
        for(let i in assets.data){
          if(assets.data[i].address == "USDo1uHcFo9H6aHWcqCkhBiWiMhUqQJFienbKDBPEhN"){
            data.value = assets.data[i];
          }
        }
        console.log(data.value);
        
    } catch (error) {
        console.error('Error in watchEffect:', error);
    }
});

selectLanguage(appStore.$state.language);

const charts = ref({
  height: 30,
  options: {
    chart: { type: "line", sparkline: { enabled: true } },
    colors: [appVariable.color.theme],
    stroke: {
      width: 2
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "65%",
        endingShape: "rounded",
      },
    },
    yaxis: {
      min: 3000
    }
  },
  series: [
    {
      name: "Visitors",
      data: [
        3040, 3050, 3060, 3034, 3060, 3055, 3089, 3099, 3093, 3046, 3044
      ],
    },
  ],
});

onMounted(() => {
  watchEffect(() => {
    rate.value = appStore.rate;
    infoRender()
  })
})



const infoRender = () => {
  let time = null;
  time =
    appStore.datarate.updated_at == null
      ? "a day ago"
      : appStore.datarate.updated_at;
  // console.log(appStore.datarate);

  info.value = [
    {
      icon: "fas fa-lg fa-fw me-2 fa-hourglass",
      language: "price",
      text: data.value? smartFormatNumber(data.value.price) : '0',
    },
    {
      icon: "fab fa-lg fa-fw me-2 fa-flickr",
      language: "CirculatingSupply",
      text: data.value ? come(toFexedStake(data.value.supply,data.value.decimals)) : '0',
    },
    {
      icon: "fas fa-lg fa-fw me-2 fa-money-bill-alt",
      language: "holders",
      text: data.value? come(data.value.holders) : '0'
    },
  ];
}

const randomNo = () => {
  return Math.floor(Math.random() * 2) + 3;
};
const toFexedStake = (num, decimals) => {
    if (num == null || decimals == null) {
        console.error('Number and decimals must be provided.');
        return 0;
    }
    const divisor = Math.pow(10, JSON.parse(decimals));

    return (JSON.parse(num) / divisor).toFixed(0);;

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
