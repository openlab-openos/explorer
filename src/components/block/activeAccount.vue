<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">24H Active Account</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px">
              <numberAnimar :count="JSON.parse(data.users == undefined ? '10' : data.users)" />
              <!-- {{ data.blockHeight }} -->
            </h5>
          </div>

          <div style="width: 40%; height: 30px">
            <div>
              <div ref="echartsContainers" style="width:100%; height: 30px;display:flex ;justify-content: center;">
              </div>
            </div>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate" v-if="info != null">
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
import { onMounted, ref, watchEffect } from "vue";
import { useAppStore } from "@/stores/index";
import * as echarts from 'echarts';



const appStore = useAppStore();
const data = ref({});
const randomNo = () => {
  return Math.floor(Math.random() * 60) + 30;
};

const echartsContainers = ref(null);

const initECharts = () => {
  const myChart = echarts.init(echartsContainers.value);
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
      }
    },
    series: [{
      type: 'bar',
      data: [
        randomNo(),
        randomNo(),
        randomNo(),
        randomNo(),
        randomNo(),
        randomNo(),
        randomNo(),
        randomNo(),
        randomNo(),
        randomNo(),
      ],
      itemStyle: {
        normal: {
          color: '#008FFB',
          barBorderRadius: 0, // 去除条形图的圆角  
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


const orderrequest = async (url) => {
  await order(url).then((res) => {

    data.value = res;
  });
};

orderrequest("users_per_day");

const chart = ref();

const info = ref([]);

const infoDatalength = ref(0);
const countName = ref();
const counPct = ref();

onMounted(() => {
  renders()
  watchEffect(() => {
    infoDatalength.value = appStore.Validators.length;
    countName.value = appStore.country.timezone;
    counPct.value = appStore.country.pct;
    renders()
  })
})


console.log(appStore.Validators);



const renders = () => {
  info.value = [
    {
      icon: "fas fa-lg fa-fw me-2 fa-chart-pie",
      text: "9.4% more than last week",
    },
    {
      icon: "fas fa-lg fa-fw me-2 fa-adjust",
      text: infoDatalength.value + " " + "Validators",
    },
    {
      icon: "fab fa-lg fa-fw me-2 fa-chrome",
      text:
        countName.value ? countName.value +
          " " +
          "node  for" +
          " " +
          counPct.value +
          "%" : 'Loading……'
    },
  ];
}



</script>
