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
          <div
            style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            "
          >
            <h5 style="display: flex; height: 30px">
              <numberAnimar :count="JSON.parse(data.transactionCount)" />
              <!-- {{ data.blockHeight }} -->
            </h5>
          </div>

          <div style="width: 40%; height: 30px">
            <div v-if="chart != null">
              <apexchart
                :height="chart.height"
                :options="chart.options"
                :series="chart.series"
              ></apexchart>
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
import { useAppVariableStore } from "@/stores/app-variable";

const appVariable = useAppVariableStore();

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
      unnumTranstions: [],
      trueTramsatiom: 0,
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
        try {
          this.data = res.result;
        } catch (error) {
          console.log(error);
        }
      });
    },
    async performanceSamples() {
      let requestBody = {
        jsonrpc: "2.0",
        id: 1,
        method: "getRecentPerformanceSamples",
        params: [24],
      };
      await chainRequest(requestBody)
        .then((response) => {
          for (let i in response.result) {
            this.unnumTranstions.push(
              JSON.parse(response.result[i].numTransactions) +
                JSON.parse(response.result[i].numNonVoteTransactions)
            );
            this.trueTramsatiom += JSON.parse(
              response.result[i].numNonVoteTransactions
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching epoch info:", error);
        });
    },
    randomNo() {
      return Math.floor(Math.random() * 60) + 30;
    },
  },
  async mounted() {
    await this.fetchData();

    await this.performanceSamples();

    let countTranstions = 0;
    for (let i in this.unnumTranstions) {
      countTranstions += this.unnumTranstions[i];
    }


    setInterval(async () => {
      await this.fetchData();
    }, 3000);
    this.chart = {
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
      series: [this.randomNo(), this.randomNo(), this.randomNo()],
    };
    this.info = [
      {
        icon: "fa fa-chevron-up fa-fw me-1",
        text: "True TPM" + " " + this.trueTramsatiom,
      },
      {
        icon: "far fa-hdd fa-fw me-1",
        text: "Vote TPS" + " " + this.unnumTranstions[23],
      },
      { icon: "far fa-hand-point-up fa-fw me-1", text: "Theoretical TPS 30W" },
    ];
  },
};
</script>
