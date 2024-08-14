<template>
  <div class="col-lg-6 col-xl-3" v-if="data.blockHeight != undefined">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">Network (Transactions)</span>
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
              <numberAnimar :count="JSON.parse(data.transactionCount)" />
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
import { chainRequest } from "../../request/chain";
import numberAnimar from "../../components/CountFlop.vue";
import apexchart from "@/components/plugins/Apexcharts.vue";
import { useAppVariableStore } from "@/stores/app-variable";
import { onMounted, ref } from 'vue'

const appVariable = useAppVariableStore();

const data = ref({});
const chart = ref(null);
const info = ref(null);
const timer = ref(null);
const unnumTranstions = ref([]);
const trueTramsatiom = ref(0);

const fetchData = async () => {
  let requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getEpochInfo",
    params: [], // 如果需要的话}
  };
  await chainRequest(requestBody).then((res) => {
    try {
      data.value = res.result;
    } catch (error) {
      console.log(error);
    }
  })
}

fetchData()

const performanceSamples = async () => {
  let requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getRecentPerformanceSamples",
    params: [24],
  };
  await chainRequest(requestBody)
    .then((response) => {
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
          icon: "fas fa-lg fa-fw me-2 fa-stop-circle",
          text: "True TPM" + " " + trueTramsatiom.value,
        },
        {
          icon: "far fa-lg fa-fw me-2 fa-registered",
          text: "Vote TPS" + " " + unnumTranstions.value[23],
        },
        { icon: "fab fa-lg fa-fw me-2 fa-mizuni", text: "Theoretical TPS 30W" },
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

const setTime = () => {
  timer.value = setInterval(async () => {
    await fetchData();
  }, 3000);
}

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
  },
  series: [randomNo(), randomNo(), randomNo()],
}



function stopTimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}

onMounted(() => {
  setTime()
})

defineExpose({
  stopTimer
})
</script>