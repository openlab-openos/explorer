<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t("dashboard.active_stake") }}</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px; font-size:0.9rem;line-height: 30px;">
              {{ data }}M / {{ stubly }}M
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
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ $t(statInfo.language) }} {{ statInfo.text }}</div>
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
import { useAppStore } from "../../stores/index";
import { onMounted, ref, watchEffect } from "vue";
import { constants } from "buffer";
import i18n from "@/i18n"
const appStore = useAppStore();

const appVariable = useAppVariableStore();

const stubly = ref(1);
const data = ref(1);
const epoch = ref(1);
const info = ref();

// 语言
function selectLanguage(indexValue) {
  i18n.global.locale = indexValue;
}
watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

const randomNo = () => {
  return Math.floor(Math.random() * 60) + 30;
};

onMounted(() => {
  watchEffect(() => {
    epoch.value = appStore.network
    data.value = appStore.pubbley;

    stubly.value = appStore.stubly;
    info.value = [
      {
        icon: ['fas', 'chevron-up'],
        language: "dashboard.average_per_node",
        text:
          " " +
          (appStore.stubly / (appStore.network / 1000000)).toFixed(2) +
          "M",
      },
      {
        icon: ['far', 'hdd'],
        language: "",
        text: "TVL" + " " + "$" + (JSON.parse(appStore.pubbley) * appStore.rate).toFixed(2) + "M",
      },
      {
        icon: ['far', 'hand-point-up'],
        language: "dashboard.pledge_rate",
        text:
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
    tooltip: {
      enabled: false
    },
  },
  series: [randomNo(), randomNo(), randomNo()],
});

</script>
