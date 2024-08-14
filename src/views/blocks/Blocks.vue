<template>
  <div class="blocks">
    <div class="blocks-left">
      <div>
        <h4>Blocks</h4>
      </div>
      <div class="row">
        <div class="col-xl-3 col-lg-6" v-for="(stat, index) in block" :key="stat">
          <card class="mb-3">
            <card-body>
              <div class="d-flex fw-bold small mb-3">
                <span class="flex-grow-1">{{ stat.name }} </span>
              </div>
              <h5 class="text-theme" style="display: flex">
                <count-up :startVal="initial[index].value" :end-val="stat.value" duration="2"
                  :decimalPlaces="stat.type ? 1 : 0"></count-up>
                <span v-show="stat.type">%</span>
              </h5>
            </card-body>
          </card>
        </div>
      </div>
      <div class="row">
        <card class="md-3">
          <card-body>
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cluster time</td>
                  <td style="text-align: right">
                    {{ cluster }}
                  </td>
                </tr>
                <tr>
                  <td>Slot time (1min average)</td>
                  <td style="text-align: right">400ms</td>
                </tr>
                <tr>
                  <td>Slot time (1hr average)</td>
                  <td style="text-align: right">400ms</td>
                </tr>
                <tr>
                  <td>Epoch</td>
                  <td style="text-align: right; cursor: pointer" class="text-theme" @click="epochSkip(epoch)">
                    {{ epoch }}
                  </td>
                </tr>
                <tr>
                  <td>Epoch progress</td>
                  <td style="text-align: right" class="text-theme">
                    {{ progress }}%
                  </td>
                </tr>
                <tr>
                  <td>Epoch time remaining (approx.)</td>
                  <td style="text-align: right">
                    {{ time }}
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
    </div>
    <!-- <div class="blocks-right">
      <div v-for="stat in cards" :key="stat" style="margin: 10px 10%">
        <card class="mb-3">
          <card-body>
            <div class="cards">
              <h5>
                <span class="text-theme">{{ stat.number }}</span>
              </h5>
            </div>
          </card-body>
        </card>
      </div>
    </div> -->
  </div>
</template>

<script>
import { chainRequest } from "../../request/chain";
import CountUp from "vue-countup-v3";
import moment from "moment";
import numberAnimar from "../../components/CountFlop.vue";

export default {
  components: {
    CountUp: CountUp,
    numberAnimar,
  },
  data() {
    return {
      block: [
        {
          name: "Slot",
          value: 0,
          type: false,
        },
        {
          name: "Block height",
          value: 0,
          type: false,
        },
        {
          name: "Slot time",
          value: 400,
          type: false,
        },
        {
          name: "Epoch progress",
          value: 0,
          type: true,
        },
      ],
      initial: [
        {
          name: "Slot",
          value: 0,
        },
        {
          name: "Block height",
          value: 0,
        },
        {
          name: "Slot time",
          value: 0,
        },
        {
          name: "Epoch progress",
          value: 0,
        },
      ],
      cards: [],
      setInter: null,
      epoch: 0,
      time: {
        day: 0,
        hours: 0,
        minutes: 0,
        remainingSeconds: 0,
      },
      progress: "0%",
      cluster: null
    };
  },
  async mounted() {
    let request = {
      id: 2,
      jsonrpc: "2.0",
      method: "getEpochInfo",
      params: [],
    };
    await this.getBlock(request);
    this.setInter = setInterval(() => {
      this.getBlock(request);
    }, 2000);
  },
  unmounted() {
    clearInterval(this.setInter);
  },
  methods: {
    async getBlock(requestBody) {
      await chainRequest(requestBody)
        .then((result) => {
          this.initial[0].value = this.block[0].value;
          this.initial[1].value = this.block[1].value;
          this.block[1].value = result.result.blockHeight;
          this.block[0].value = result.result.absoluteSlot;
          this.cards = [];
          this.epoch = result.result.epoch;
          this.time = this.getTime(
            result.result.slotsInEpoch - result.result.slotIndex
          );
          let d = new Date();
          this.cluster = moment(d).utc().format();
          this.progress = (
            (result.result.slotIndex / result.result.slotsInEpoch) *
            100
          ).toFixed(1);
          this.block[3].value = this.progress;
          for (let i = 0; i < 5; i++) {
            let count = JSON.parse(this.block[0].value) - i;
            this.cards.push({
              number: count,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTime(timestamp) {
      return moment(
        JSON.parse(moment().format("x")) + timestamp * 400
      ).fromNow();
    },
    epochSkip(num) {
      this.$router.push({
        name: "epoch",
        params: {
          num: num,
        },
      });
    }
  },
};
</script>

<style scoped>
.blocks {
  width: 100%;
  display: flex;
}

.blocks-left {
  width: 100%;
}

.blocks-right {
  width: 20%;
}

.cards {
  width: 100%;
  height: 100px;
  text-align: center;
}

.cards h5 {
  line-height: 100px;
}

table {
  width: 100%;
}
</style>
