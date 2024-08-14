<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">Active Stake (BTG)</span>
          <card-expand-toggler />
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px; font-size:0.9rem;">
              {{ data }} M/{{ stubly }} M
              <!-- {{ data.blockHeight }} -->
            </h5>
          </div>
          <div style="width: 40%; height: 30px">
            <div v-if="chart != null">
              <apexchart :height="chart.height" :options="chart.options" :series="chart.series"></apexchart>
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
import { chainRequest } from "../../request/chain";
import { useAppVariableStore } from "@/stores/app-variable";
import { ustdData } from "../../request/ustd";
import { useAppStore } from "../../stores/index";
import { onMounted, ref, watchEffect } from "vue";
import { constants } from "buffer";
const appStore = useAppStore();

const appVariable = useAppVariableStore();

const stubly = ref(1);
const data = ref(1);
const epoch = ref(1);
const info = ref();

setTimeout(() => {
  data.value = appStore.pubbley;

  stubly.value = appStore.stubly;
}, 2000);

const datavalue = async () => {
  if (appStore.stubly == 0) {
    await chainRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "getSupply",
    }).then((res) => {
      stubly.value = (
        JSON.parse(JSON.stringify(res.result.value.total).slice(0, 9)) / 1000000
      ).toFixed(1);
    }).then(res => {

    })
    await chainRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "getVoteAccounts",
      params: [],
    })
      .then((res) => {
        let btg = res.result;
        let btgcont = 0;
        let btgcount = 0;
        if (btg) {
          for (let i in btg.current) {
            btgcont += JSON.parse(JSON.stringify(btg.current[i].activatedStake));
          }
          btgcount = btgcont;
          let num = (btgcont / 1000000000).toFixed(0);
          btgcont = (num / 1000000).toFixed(1);
        }
        data.value = btgcont;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    stubly.value = appStore.stubly;
    data.value = appStore.pubbley;
  }
}
datavalue();

const chainData = async () => {
  await chainRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "getEpochInfo",
  }).then((res) => {
    epoch.value = res.result.epoch;
  });
};

chainData();

const randomNo = () => {
  return Math.floor(Math.random() * 60) + 30;
};

onMounted(() => {
  watchEffect(() => {
    info.value = [
      {
        icon: "fa fa-chevron-up fa-fw me-1",
        text:
          "Average per node" +
          " " +
          (stubly.value / epoch.value).toFixed(2) +
          "M",
      },
      {
        icon: "far fa-hdd fa-fw me-1",
        text: "TVL" + " " + "$" + (JSON.parse(data.value) * appStore.rate).toFixed(2) + "M",
      },
      {
        icon: "far fa-hand-point-up fa-fw me-1",
        text:
          "Pledge rate" +
          " " +
          ((appStore.btgcount / (appStore.stuBlys - 74)) * 100).toFixed(2) +
          "%",
      },
    ];
  })
})

const chart = ref({
  height: 45,
  options: {
    chart: { type: "donut", sparkline: { enabled: true } },
    colors: [
      "rgba(" + appVariable.color.themeRgb + ", 1)",
      "rgba(" + appVariable.color.themeRgb + ", .75)",
      "rgba(" + appVariable.color.themeRgb + ", .5)",
    ],
    stroke: { show: false },
  },
  series: [randomNo(), randomNo(), randomNo()],
});

</script>
