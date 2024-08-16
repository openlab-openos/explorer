<template>
  <div>
    <div v-show="shoeType" class="row">
      <div
        class="col-xl-3 col-lg-6"
        v-for="(item, index) in Vaildators"
        :key="index"
      >
        <!-- BEGIN card -->
        <card class="mb-3">
          <card-body>
            <div class="d-flex fw-bold small mb-3">
              <span class="flex-grow-1">{{ item.name }} </span>

              <card-expand-toggler />
            </div>
            <h5>
              <span class="text-theme">{{ item.value }}</span>
            </h5>
          </card-body>
        </card>
        <!-- END card -->
      </div>

      <div class="col-xl-6" style="width: 100%">
        <card class="mb-3">
          <card-body>
            <div class="d-flex fw-bold small mb-3">
              <span class="flex-grow-1">Validators</span>
              <card-expand-toggler />
            </div>
            <div class="table-responsive">
              <table
                class="table table-striped table-borderless mb-2px small text-nowrap"
              >
                <tbody>
                  <tr>
                    <th>NAME</th>
                    <th style="text-align: left">PUBKEY</th>
                    <th style="text-align: left">ACTIVATED STAKE</th>
                    <th style="text-align: left">GOSSIP</th>

                    <th style="text-align: left">STATUS</th>
                  </tr>
                  <tr
                    v-if="ActivityLogData"
                    v-for="(log, index) in ActivityLogData"
                    :key="index"
                  >
                    <td>
                      <span class="d-flex align-items-center">
                        <img
                          :src="log.icon"
                          alt=""
                          width="20"
                          style="margin: 0px 5px"
                        />
                        {{ log.name }}
                      </span>
                    </td>
                    <td style="text-align: left">
                      <span
                        class="text-theme"
                        style="cursor: pointer"
                        @click="pubbleys(log.pubkey)"
                      >
                        {{ log.pubkey }}
                        <!-- {{ log.pubkey }} -->
                      </span>
                    </td>
                    <td style="text-align: left; display: flex">
                      <count-up
                        :startVal="toFexedStake(log.activatedStake)"
                        :end-val="toFexedStake(log.activatedStake)"
                        duration="3"
                      ></count-up>
                      &nbsp; BTG &nbsp; (
                      {{ countplount(log.activatedStake) }}
                      )
                    </td>
                    <td style="text-align: left">
                      {{ log.ip }}
                    </td>
                    <td style="text-align: left">
                      <span
                        :style="{
                          color: log.activatedStake !== '' ? 'green' : 'yellow',
                        }"
                        class="menu-icon"
                      >
                        <i
                          class="fas fa-lg fa-fw me-2 fa-check-circle"
                          v-if="log.activatedStake !== ''"
                        ></i>
                        <i
                          class="fas fa-lg fa-fw me-2 fa-question-circle"
                          v-if="log.activatedStake == ''"
                        ></i>
                        <!-- {{ log.pubkey }} -->
                      </span>
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="4">No records found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </card-body>
        </card>
      </div>
    </div>
    <div v-show="!shoeType">Loading……</div>
  </div>
</template>


<script setup>
import { useAppStore } from "../../stores/index";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CountUp from "vue-countup-v3";

const router = useRouter();

const appStore = useAppStore();

const shoeType = ref(false);

const Vaildators = ref([
  {
    name: "Vaildators",
    value: 0,
  },
  {
    name: "Weighted Skip Rate",
    value: 0,
  },
  {
    name: "Nominal Staking APY",
    value: 0,
  },
  {
    name: "Node Versions",
    value: 0,
  },
]);

const ActivityLogData = ref([]);
ActivityLogData.value = appStore.Validators;

Vaildators.value[0].value = ActivityLogData.value.length;

Vaildators.value[1].value = (appStore.part * 100).toFixed(2) + "%";
Vaildators.value[2].value = appStore.stake + "%";
Vaildators.value[3].value = ActivityLogData.value[0].version;

const toFexedStake = (num) => {
  if (num) {
    return (num / 1000000000).toFixed(0);
  }
};

const countLog = ref(1);

for (let i in ActivityLogData.value) {
  countLog.value += ActivityLogData.value[i].activatedStake;
}

const countplount = (num) => {
  return ((num / countLog.value) * 100).toFixed(2) + "%";
};

shoeType.value = true;

const pubbleys = (url) => {
  router.push({
    name: "address",
    params: {
      url: url,
    },
  });
};
</script>
