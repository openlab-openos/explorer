<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t( "dashboard.network_transactions" ) }} </span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px">

              <numberAnimar :count="JSON.parse(data)" />
              <!-- {{ data.blockHeight }} -->
            </h5>
          </div>
          <div style="width: 40%; height: 30px">
            <div v-if="chart != null">
              <apexchart :height="chart.height" :options="chart.options" :series="chart.series"  style="margin-top: -10px;"></apexchart>
            </div>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <!-- <div><i v-bind:class="statInfo.icon"></i> {{ statInfo.text }}</div> -->
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ $t(statInfo.language) }}  {{ statInfo.text }}</div>

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
import { useAppVariableStore } from "@/stores/app-variable";
import { onMounted, ref, watchEffect } from 'vue'
import { useAppStore } from "@/stores/index";
import i18n from "@/i18n";


const appVariable = useAppVariableStore();
const appStore = useAppStore();


const data = ref(0);
const chart = ref(null);
const info = ref(null);
const timer = ref(null);
const unnumTranstions = ref([]);
const trueTramsatiom = ref(0);


// 语言
function selectLanguage(indexValue){
  
  
  i18n.global.locale = indexValue;
}
watchEffect(()=>{
  selectLanguage(appStore.$state.language);
})

onMounted(() => {
  watchEffect(() => {
    data.value = appStore.network
  })
})


const performanceSamples = () => {
  let requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getRecentPerformanceSamples",
    params: [24],
  };
  chainRequest(requestBody)
    .then((response) => {
<<<<<<< HEAD
=======
      appStore.setRecentPerformanceSamples(response.result)
>>>>>>> master
      for (let i in response.result) {
        unnumTranstions.value.push(
          JSON.parse(response.result[i].numTransactions) +
          JSON.parse(response.result[i].numNonVoteTransactions)
        );
        trueTramsatiom.value += JSON.parse(
          response.result[i].numNonVoteTransactions
        );
      }
      info.value = [
        {
          icon: ['fas', 'stop-circle'],
          language:"dashboard.true",
          text: trueTramsatiom.value,
        },
        {
          icon: ['far', 'registered'],
          language:"dashboard.vote",
          text:  unnumTranstions.value[23],
        },
        {
          icon: ['fab', 'mizuni'],
          language:"dashboard.theoretical",
          text: " 300K",
        },
      ]
    })
    .catch((error) => {
      console.error("Error fetching epoch info:", error);
    });
}

performanceSamples()

const randomNo = () => {
  return Math.floor(Math.random() * 60) + 30;
};

chart.value = {
  height: 45,
  options: {
    chart: { type: "pie", sparkline: { enabled: true } },
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
}

</script>