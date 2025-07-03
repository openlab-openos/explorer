<script setup>
import {
  defineAsyncComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect,
} from 'vue';

import jsVectorMap from 'jsvectormap';
import moment from 'moment';
import CountUp from 'vue-countup-v3';
import { useRouter } from 'vue-router';

import apexchart from '@/components/plugins/Apexcharts.vue';
import i18n from '@/i18n';
import { useAppVariableStore } from '@/stores/app-variable';
import { useAppStore } from '@/stores/index';

import { chainRequest } from '../../request/chain';
import { ustdData } from '../../request/ustd';

const appStore = useAppStore();
const appVariable = useAppVariableStore();

const apps = getCurrentInstance();


const slot = ref(1);
const inepoch = ref(1);
const epoch = ref();
const solttime = ref();

const pubbley = ref(1);
const stubly = ref(1);
const server = ref([]);

const activeVueref = ref(null);
const networkref = ref(null);
const router = useRouter();
const renderType = ref(false);

const BlockHeightVue = defineAsyncComponent(() =>
  import("../../components/block/blockHeight.vue")
);
const NetWorkVue = defineAsyncComponent(() =>
  import("../../components/block/netWork.vue")
);
const ActiveAccountVue = defineAsyncComponent(() =>
  import("../../components/block/activeAccount.vue")
);
const TransferVue = defineAsyncComponent(() =>
  import("../../components/block/transfer.vue")
);
const SupplyVue = defineAsyncComponent(() =>
  import("../../components/block/supply.vue")
);
const ActiveVue = defineAsyncComponent(() =>
  import("../../components/block/active.vue")
);
const PriceVue = defineAsyncComponent(() =>
  import("../../components/block/price.vue")
);
const PriceBtgVue = defineAsyncComponent(() =>
  import("../../components/block/priceBtg.vue")
);
const mapDeshboard = defineAsyncComponent(() =>
  import("../../components/dashboard/map.vue")
);
const orderVue = defineAsyncComponent(() =>
  import("../../components/transaction/list.vue")
);
const validatorsVue = defineAsyncComponent(() =>
  import("../../components/validators/validators_list.vue")
);

const Gettype = JSON.parse(sessionStorage.getItem("urlType"))

// 语言
function selectLanguage(indexValue) {
  i18n.global.locale = indexValue;
}

watchEffect(() => {
  selectLanguage(appStore.$state.language);
})
const requestType = ref(false);

ustdData().then((data) => {
  appStore.setRate(data.data.rate);
  appStore.getRateData(data.data);
});

const unnumTranstions = ref([]);
const timeName = ref([]);
const cote = ref([]);
const trueTramsatiom = ref([]);

const performanceSamples = async () => {
  unnumTranstions.value = [];
  let res = appStore.getRecentPerformanceSamples;
  for (let i in res) {
    timeName.value.unshift(
      JSON.parse(i) + 1 == 1
        ? "a" + "minutes ago "
        : JSON.parse(i) + 1 + "minutes ago "
    );
    cote.value.push(JSON.parse(res[i].numTransactions));
    trueTramsatiom.value.push(
      JSON.parse(res[i].numNonVoteTransactions)
    );
    unnumTranstions.value.push(
      JSON.parse(res[i].numTransactions) +
      JSON.parse(res[i].numNonVoteTransactions)
    );
  }

};

const getTime = (timestamp) => {
  return moment(JSON.parse(moment().format("x")) + timestamp * 400).fromNow();
};
const ReadyType = ref(true)

const supplyRequest = async (epoch, slot, inepoch, solttime) => {
  console.log(requestType.value);
  if (ReadyType.value) {
    console.log(123456);
    
    await chainRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "getSupply",
    })
      .then((res) => {
        stubly.value = (
          JSON.parse(JSON.stringify(res.result.value.total).slice(0, 9)) / 1000000
        ).toFixed(1);
        console.log(res);

        appStore.setStubly(stubly.value);
        appStore.setStuBlys(res.result.value.total);
      })
      .catch((err) => {
        console.log(err);
      });
    pubbley.value = appStore.pubbley;
    ReadyType.value = false;
    // requestType.value = false;

  }
  server.value = getServerData(epoch, slot, inepoch, solttime);

};


const getServerData = (epoch, slot, inepoch, solttime) => {

  Apex = {
    title: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: appVariable.font.bodyFontfamily,
        color: appVariable.color.bodyColor,
      },
    },
    legend: {
      fontFamily: appVariable.font.bodyFontfamily,
      labels: {
        colors: appVariable.color.bodyColor,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: appVariable.font.bodyFontfamily,
      },
    },
    grid: {
      borderColor: "rgba(" + appVariable.color.bodyColorRgb + ", .25)",
    },
    dataLabels: {
      style: {
        fontSize: "12px",
        fontFamily: appVariable.font.bodyFontfamily,
        fontWeight: "bold",
        colors: undefined,
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
        color: "rgba(" + appVariable.color.bodyColorRgb + ", .25)",
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: -1,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "rgba(" + appVariable.color.bodyColorRgb + ", .25)",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
      labels: {
        style: {
          colors: appVariable.color.bodyColor,
          fontSize: "12px",
          fontFamily: appVariable.font.bodyFontfamily,
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: appVariable.color.bodyColor,
          fontSize: "12px",
          fontFamily: appVariable.font.bodyFontfamily,
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      min: Gettype ? (Gettype.urlType == 'Formal' ? 3000 : 0) : 3000,
    },
  };
  return {
    chart: {
      series: [
        {
          name: "TPM history",
          data: unnumTranstions.value,
        },
      ],
      options: {
        colors: [appVariable.color.theme],
        xaxis: {
          categories: [],
          labels: { show: false },
        },
        fill: { opacity: 0.65 },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            return `<div class="custom-tooltip" style="padding:5px">  
              <div>vote: ${cote.value[dataPointIndex]}</div> 
              <div>true ${trueTramsatiom.value[dataPointIndex]}</div> 
              <div>${timeName.value[dataPointIndex]} </div> 
            </div>`;
          },
        },
        chart: {
          height: "100%",
          type: "bar",
          toolbar: { show: false },
          labels: timeName.value,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: { enabled: false },
        grid: {
          show: true,
          borderColor: "rgba(" + appVariable.color.inverseRgb + ", .15)",
        },
        stroke: { show: false },
      },
    },
    stats: [
      {
        name: "epoch_progress",
        // name:"dashboard",
        total: slot,
        totals: inepoch,
        unit: "",
        progress: "20%",
        time: "dashboard.last_time",
        info: [
          {
            title: "epoch",
            value: epoch,
            class: "text-theme",
            style: "cursor: pointer",
            click: true,
          },
          {
            title: "epoch_time_remaining",
            value: solttime,
            class: "text-theme text-opacity-50",
            style: "",
            click: false,
          },
        ],

        chart: {
          height: 50,
          options: {
            chart: { type: "donut", sparkline: { enabled: true } },
            colors: [],
            stroke: {
              show: false,
              curve: "smooth",
              lineCap: "butt",
              colors: "rgba(" + appVariable.color.blackRgb + ", .25)",
              width: 2,
              dashArray: 0,
            },
            plotOptions: { pie: { donut: { background: "transparent" } } },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return `<div class="custom-tooltip" style="padding:5px">  
                <span> ${["SlotIndex", "SlotsInEpoch"][seriesIndex]} : </span> 
                <span>${series[seriesIndex] * 100} % </span> 
              </div>`;
              },
            },
          },
          series: [
            JSON.parse((slot / inepoch).toFixed(2)),
            JSON.parse((1 - slot / inepoch).toFixed(2)),
            // 0.39, 0.61,
          ],
        },
      },
      {
        name: "dashboard.active_stake",
        total: pubbley.value,
        totals: stubly.value,
        unit: "M",
        progress: "10%",
        time: "dashboard.last_time",
        info: [
          {
            title: "dashboard.active_stake",
            value: pubbley.value + "M",
            class: "text-theme",
            style: "",
            click: false,
          },
          {
            title: "dashboard.total_supply",
            value: stubly.value + "M",
            class: "text-theme text-opacity-50",
            click: false,
            style: "",
          },
        ],
        chart: {
          height: 50,
          options: {
            chart: { type: "donut", sparkline: { enabled: true } },
            colors: [],
            stroke: {
              show: false,
              curve: "smooth",
              lineCap: "butt",
              colors: "rgba(" + appVariable.color.blackRgb + ", .25)",
              width: 2,
              dashArray: 0,
            },
            plotOptions: { pie: { donut: { background: "transparent" } } },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return `<div class="custom-tooltip" style="padding:5px">  
                <span> ${["BTG Supply", "Active Stake"][seriesIndex]} : </span> 
                <span>${series[seriesIndex] * 100} % </span> 
              </div>`;
              },
            },
          },
          series: [
            // JSON.parse(pubbley.value), JSON.parse(stubly.value)
            JSON.parse((pubbley.value / stubly.value).toFixed(2)),
            JSON.parse((1 - pubbley.value / stubly.value).toFixed(2)),
          ],
        },
      },
    ],
  };
};

const epochSkip = (num) => {
  router.push({
    name: "epoch",
    params: {
      num: num,
    },
  });
};

watchEffect(async () => {
  const response = appStore.getepochInfo;
  solttime.value = getTime(
    response.slotsInEpoch - response.slotIndex
  );
  appStore.setEposhTome(solttime.value);
  console.log(response.slotsInEpoch);
  console.log(response.slotIndex);
  console.log(response.slotsInEpoch - response.slotIndex);
  console.log(getTime(
    response.slotsInEpoch - response.slotIndex
  ));


  if (response) {

  }
  await performanceSamples();
  console.log(response.epoch, response.slotIndex, response.slotsInEpoch, solttime.value);
  if (response.epoch && response.slotIndex && response.slotsInEpoch && solttime.value) {
    console.log(renderType.value);
    if (!requestType.value) {
      requestType.value = true;
    }
    console.log(123);
  } else {
    requestType.value = false;
    console.log(222);

  }
  if (requestType.value) {
    await supplyRequest(response.epoch, response.slotIndex, response.slotsInEpoch, solttime.value);
  }

});

onBeforeUnmount(() => {
  if (activeVueref.value) {
    activeVueref.value.stopTimer();
  }
});
</script>



<template>
  <div class="row">
    <blockHeightVue ref="activeVueref" />
    <netWorkVue ref="networkref" />
    <activeAccountVue />
    <transferVue />
    <supplyVue />
    <activeVue />
    <priceVue />
    <priceBtgVue />
  </div>
  <div class="row">
    <!-- BEGIN stats -->

    <!-- BEGIN server-stats -->
    <div class="col-xl-6">
      <card class="mb-3" v-show="server.stats">
        <card-body style="min-height: 400px">
          <div class="d-flex fw-bold small mb-3">
            <span class="flex-grow-1"> TPM {{ $t("dashboard.history") }} </span>
            <!-- <card-expand-toggler /> -->
          </div>
          <div class="ratio ratio-21x9 mb-3" v-if="server.chart">
            <apexchart type="bar" width="100%" height="100%" :options="server.chart.options"
              :series="server.chart.series"></apexchart>
          </div>
          <div class="row" v-if="requestType">
            <div class="col-lg-6 mb-3 mb-lg-0" v-for="(stat, index) in server.stats" :key="index">
              <div class="d-flex align-items-center">
                <div class="w-50px h-50px">
                  <apexchart :height="stat.chart.height" :options="stat.chart.options" :series="stat.chart.series">
                  </apexchart>
                </div>
                <div class="ps-3 flex-1">
                  <div class="fs-10px fw-bold text-inverse text-opacity-50 mb-1">
                    {{ $t(stat.name) }}
                  </div>
                  <div class="mb-2 fs-5 text-truncate" style="display: flex">
                    <count-up duration="3" :startVal="stat.total" :end-val="stat.total"></count-up>
                    {{ stat.unit }}
                    /<count-up duration="3" :startVal="stat.totals" :end-val="stat.totals"></count-up>
                    {{ stat.unit }}
                  </div>
                  <div class="progress h-3px mb-1">
                    <div class="progress-bar bg-theme" v-bind:style="{
                      width:
                        JSON.parse((stat.total / stat.totals).toFixed(2)) *
                        100 +
                        '%',
                    }"></div>
                  </div>
                  <div class="fs-11px text-inverse text-opacity-50 mb-2 text-truncate">
                    {{ $t(stat.time) }}
                  </div>
                  <div class="d-flex align-items-center small" v-for="(info, index) in stat.info" :key="index">
                    <i class="bi bi-circle-fill fs-6px me-2" v-bind:class="info.class"></i>
                    <div class="flex-1" style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      ">
                      {{ $t(info.title) }}
                    </div>
                    <div :style="info.style" @click="info.click ? epochSkip(info.value) : ''" class="text-theme">
                      {{ info.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </card-body>
      </card>
    </div>
    <!-- END server-stats -->

    <!-- BEGIN traffic-analytics -->
    <mapDeshboard></mapDeshboard>
    <!-- END traffic-analytics -->
    <div class="col-xl-6">
      <orderVue :boolean="true" />
    </div>
    <div class="col-xl-6">
      <validatorsVue :type="true" />
    </div>

    <!-- END activity-log -->
  </div>
  <!-- <div>Loading……</div> -->
  <!-- END row -->
</template>

<style scoped>
td {
  text-align: center;
}

/* .table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
} */
</style>
