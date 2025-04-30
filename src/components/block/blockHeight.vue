<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t("dashboard.block_height") }} </span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px" v-if="data.blockHeight != null">
              <numberAnimar :count="JSON.parse(data.blockHeight)" />
              <!-- {{ data.blockHeight }} -->
            </h5>
          </div>
          <div style="width: 40%; height: 30px">
            <div>
              <apexchart :height="charts.height" :options="charts.options" :series="charts.series"></apexchart>
              <!-- <VueApexCharts height="30" type="bar" :options="charts.options" :series="charts.series" /> -->
            </div>
          </div>
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
import { chainRequest } from "../../request/chain";
import numberAnimar from "../../components/CountFlop.vue";
import apexchart from "@/components/plugins/Apexcharts.vue";
import moment from "moment";
import { useAppStore } from "@/stores/index";
import { onMounted, ref, watchEffect } from 'vue'
import { useAppVariableStore } from "@/stores/app-variable";
import i18n from "@/i18n";
import VueApexCharts from "vue3-apexcharts";

const componentKey = ref(0);
const appVariable = useAppVariableStore();

const appStore = useAppStore();


const data = ref({});
const chart = ref(null);
const info = ref(null);
const timer = ref(null);

// 语言
function selectLanguage(indexValue) {


  i18n.global.locale = indexValue;
}
watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

const fetchData = async () => {
  let requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getEpochInfo",
    params: [], // 如果需要的话}
  };
  await chainRequest(requestBody).then((res) => {
    data.value = res.result;
    appStore.setEpochInfo(res.result)
    console.log(res.result);
    
    appStore.getNetwork(res.result.transactionCount)
    info.value = [
      {
        icon: "fab fa-lg fa-fw me-2 fa-openid",
        language: "dashboard.current_solt",
        text: " " + formatNumber(data.value.slotIndex),
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-pagelines",
        language: "dashboard.total_slot",
        text: " " + formatNumber(data.value.slotsInEpoch),
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-yelp",
        language: "dashboard.epoch_time_remaining_in",
        text:
          " " +
          getTime(data.value.slotsInEpoch - data.value.slotIndex),
      },
    ];
  });
};

const getTime = (timestamp) => {
  return moment(
    JSON.parse(moment().format("x")) + timestamp * 400
  ).fromNow();
};

const charts = ref({
  height: 30,
  options: {
    chart: { type: "bar", sparkline: { enabled: true } },
    colors: [appVariable.color.theme],
    tooltip: {
      enabled: false
    },
    yaxis: {
      min: 3000
    }
  },
  series: [
    {
      name: "Visitors",
      data: [
        3040, 3050, 3060,3034, 3060, 3055, 3089, 3099, 3093, 3046, 3044
      ],
    },
  ],
});

fetchData();

const formatNumber = (value) => {
  const num = parseInt(value, 10);
  return new Intl.NumberFormat('en-US').format(num);
};

function startTimer() {
  timer.value = setInterval(() => {
    fetchData();
  }, 3000);
}
function stopTimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}
const forceRerender = () => {
  componentKey.value += 1;
}
onMounted(() => {
  startTimer()
})

defineExpose({
  stopTimer
})



</script>