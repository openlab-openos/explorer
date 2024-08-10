<template>
  <div class="col-lg-6 col-xl-3" v-if="data.blockHeight != undefined">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> Block Height </span>
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
              <numberAnimar :count="JSON.parse(data.blockHeight)" />
              <!-- {{ data.blockHeight }} -->
            </h5>
          </div>

          <div style="width: 40%; height: 30px">
            <div>
              <div ref="echartsContainer" style="width:100%; height: 30px;"></div>
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

<script>
import { chainRequest } from "../../request/chain";
import numberAnimar from "../../components/CountFlop.vue";
import apexchart from "@/components/plugins/Apexcharts.vue";
import moment from "moment";
import { ustdData } from "../../request/ustd";
import { useAppStore } from "@/stores/index";
import * as echarts from 'echarts';

const appStore = useAppStore();

export default {
  components: {
    numberAnimar,
    apexchart,
  },
  data() {
    return {
      data: {},
      chart: null,
      info: null,
      echartsRef: null
    };
  },
  methods: {
    async fetchData() {
      let requestBody = {
        jsonrpc: "2.0",
        id: 1,
        method: "getEpochInfo",
        params: [], // 如果需要的话}
      };
      await chainRequest(requestBody).then((res) => {
        this.data = res.result;
      });
    },
    randomNo() {
      return Math.floor(Math.random() * 60) + 30;
    },
    getTime(timestamp) {
      return moment(
        JSON.parse(moment().format("x")) + timestamp * 400
      ).fromNow();
    },
    async ustd() {
      ustdData().then((data) => {
        appStore.setRate(data.data.rate);
        appStore.getRateData(data.data);
      });
    },
    initECharts() {
      const chartContainer = this.$refs.echartsContainer;
      const myChart = echarts.init(chartContainer);

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
          }
        },
        series: [{
          type: 'bar',
          data: [
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
            this.randomNo(),
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
  },
  async mounted() {
    await this.fetchData();
    await this.ustd();
    setInterval(async () => {
      await this.fetchData();
    }, 3000);
    this.initECharts();

    this.info = [
      {
        icon: "fa fa-chevron-up fa-fw me-1",
        text: "Current Slot" + " " + this.data.slotIndex,
      },
      {
        icon: "far fa-hand-point-up fa-fw me-1",
        text: "Total Slot" + " " + this.data.slotsInEpoch,
      },
      {
        icon: "far fa-hdd fa-fw me-1",
        text:
          "Epoch time remaining" +
          " " +
          this.getTime(this.data.slotsInEpoch - this.data.slotIndex),
      },
    ];
  },

};
</script>
