<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">Exchange Rate</span>
          <card-expand-toggler />
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px">
              {{ rate }} USD/BTG
            </h5>
          </div>

          <div style="width: 40%; height: 30px">
            <div>
              <div ref="echartsChar" style="width:100%; height: 40px;"></div>

              <!-- <apexchart :height="chart.height" :options="chart.options" :series="chart.series"></apexchart> -->
            </div>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <div><i v-bind:class="statInfo.icon"></i> {{ statInfo.text }}</div>
          </template>
        </div>
      </card-body>
    </card>
    <!-- END card -->
  </div>
</template>

<script setup>
import numberAnimar from "../../components/CountFlop.vue";
import apexchart from "@/components/plugins/Apexcharts.vue";
import { order } from "../../request/order";
import { ustdData } from "../../request/ustd";
import { useAppStore } from "../../stores/index";
import { ref, onMounted } from "vue";
import * as echarts from 'echarts';


const appStore = useAppStore();
const rate = ref();

const info = ref([]);

const echartsChar = ref(null);

const initECharts = () => {
  const myChart = echarts.init(echartsChar.value);

  const option = {
    // ECharts 配置项
    tooltip: {},
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
      type: 'line',
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
}

onMounted(() => {
  initECharts();
})


if (appStore.rate == 0) {
  ustdData().then((data) => {
    appStore.setRate(data.data.rate);
    appStore.getRateData(data.data);
    rate.value = JSON.parse(data.data.rate);
    infoRender()
  });
} else {
  rate.value = appStore.rate;
  setTimeout(() => {
    infoRender()
  }, 1000);
};

const infoRender = () => {
  let time = null;
  time =
    appStore.datarate.updated_at == null
      ? "a day ago"
      : appStore.datarate.updated_at;
  info.value = [
    {
      icon: "fas fa-lg fa-fw me-2 fa-hourglass",
      text: "Updated at" + " " + time,
    },
    {
      icon: "fab fa-lg fa-fw me-2 fa-flickr",
      text: "Reason Words" + " " + appStore.datarate.reason_words,
    },
    { icon: "fas fa-lg fa-fw me-2 fa-money-bill-alt", text: "5 USD When Listing" },
  ];
}

const randomNo = () => {
  return Math.floor(Math.random() * 2) + 3;
};


</script>
