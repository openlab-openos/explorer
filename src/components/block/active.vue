<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
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
            </h5>
          </div>
          <div style="width: 40%; height: 30px">
            <div v-if="chart != null">
              <apexchart :height="chart.height" :options="chart.options" :series="chart.series" style="margin-top: -10px;"></apexchart>
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
import i18n from "@/i18n"
const appStore = useAppStore();
console.log(appStore);

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
const requestType = ref(true);
onMounted(() => {
  watchEffect(async () => {
    if (requestType.value) {
      requestType.value = false;
      epoch.value = appStore.network
      await chainRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "getVoteAccounts",
        params: [],
      }).then((res) => {
        let btg = res.result;
        let btgcont = 0;
        let btgcount = 0;

        if (btg) {
          for (let i in btg.current) {
            btgcont += JSON.parse(JSON.stringify(btg.current[i].activatedStake));
          }
          btgcount = btgcont;
          console.log(btgcont);
          
          let num = (btgcont / 1000000000).toFixed(0);
          btgcont = (num / 1000000).toFixed(1);
        }
        data.value = btgcont;
        appStore.setPubbley(data.value);
        appStore.setBtgcount(btgcount);
        appStore.setVoteAccount(res);
      }).catch((err) => {
        console.log(err);
        data.value = 0;
      });


      // data.value = appStore.pubbley;

    }

    stubly.value = appStore.stubly;



    info.value = [
      {
        icon: ['fas', 'chevron-up'],
        language: "dashboard.average_per_node",
        text:
          " " +
          (data.value / appStore.Validators.length).toFixed(2) +
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
