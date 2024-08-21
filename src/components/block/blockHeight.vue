<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> Block Height </span>
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
            </div>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ statInfo.text }}</div>

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
import { onMounted, ref } from 'vue'
import { useAppVariableStore } from "@/stores/app-variable";

const appVariable = useAppVariableStore();

const appStore = useAppStore();


const data = ref({});
const chart = ref(null);
const info = ref(null);
const timer = ref(null);

const fetchData = async () => {
  let requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getEpochInfo",
    params: [], // 如果需要的话}
  };
  await chainRequest(requestBody).then((res) => {
    data.value = res.result;
    appStore.getNetwork(res.result.transactionCount)
    info.value = [
      {
        icon: "fab fa-lg fa-fw me-2 fa-openid",
        text: "Current Slot" + " " + formatNumber(data.value.slotIndex),
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-pagelines",
        text: "Total Slot" + " " + formatNumber(data.value.slotsInEpoch),
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-yelp",
        text:
          "Epoch time remaining" +
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "65%",
        endingShape: "rounded",
      },
    },
    yaxis: {
      min: 1500
    }
  },
  series: [
    {
      name: "Visitors",
      data: [
        1540, 1550, 1560, 1534, 1560, 1555, 1589, 1599, 1593, 1546, 1544
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

onMounted(() => {
  startTimer()
  // initECharts();
})

defineExpose({
  stopTimer
})



</script>