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
              <div ref="echartsRef"
                style="width:100%; height: 40px;display:flex ;justify-content: center;margin-top: -10px;"></div>
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
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue'

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

const randomNo = () => {
  return Math.floor(Math.random() * 60) + 30;
};

const getTime = (timestamp) => {
  return moment(
    JSON.parse(moment().format("x")) + timestamp * 400
  ).fromNow();
};

fetchData();
const echartsRef = ref(null);
console.log(data.value);
const initECharts = () => {
  const myChart = echarts.init(echartsRef.value);

  const option = {
    // ECharts 配置项
    tooltip: {
      formatter: function (params) {
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      max: 5,
      min: 0
    },
    series: [{
      type: 'bar',
      data: [
        1.4, 2.2, 1.7, 2.4, 1.8, 1.3, 2.5,
      ],
      itemStyle: {
        normal: {
          barBorderRadius: 0, // 去除条形图的圆角  
          color: '#008FFB',
          borderColor: 'rgba(0,0,0,0)', // 去除条形图的边框  
          borderWidth: 0 // 边框宽度，虽然上面设置了边框颜色为透明，但也可以显式设置宽度为0  
        }
      }
    }]
  };
  myChart.setOption(option);

};

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
  initECharts();
})

defineExpose({
  stopTimer
})



</script>