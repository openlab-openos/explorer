<template>
  <div>
    <div v-show="shoeType" class="row">
      <div class="col-xl-3 col-lg-6" v-for="(item, index) in Vaildators" :key="index">
        <!-- BEGIN card -->
        <card class="mb-3">
          <card-body>
            <div class="d-flex fw-bold small mb-3">
              <span class="flex-grow-1">{{ $t(item.name) }} </span>

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
              <span class="flex-grow-1"> {{ $t("validators.title") }} </span>
              <card-expand-toggler />
            </div>
            <div class="table-responsive">
              <table class="table table-striped table-borderless mb-2px small text-nowrap">
                <tbody>
                  <tr>
                    <th> {{ $t("validators.name") }} </th>
                    <th style="text-align: left">{{ $t("validators.pubkey") }}</th>
                    <th style="text-align: left"> {{ $t("validators.activated_stake") }} </th>
                    <th style="text-align: left">{{ $t("validators.gossip") }}</th>

                    <th style="text-align: left">{{ $t("validators.status") }}</th>
                  </tr>
                  <tr v-if="ActivityLogData" v-for="(log, index) in ActivityLogData" :key="index">
                    <td>
                      <span class="d-flex align-items-center">
                        <img :src="log.icon" alt="" width="20" style="margin: 0px 5px" />
                        {{ log.name }}
                      </span>
                    </td>
                    <td style="text-align: left">
                      <span class="text-theme" style="cursor: pointer" @click="pubbleys(log.pubkey)">
                        {{ promaster[log.pubkey] ? promaster[log.pubkey].name : log.pubkey }}
                      </span>
                    </td>
                    <td style="text-align: left; display: flex">
                      <count-up :startVal="toFexedStake(log.activatedStake)" :end-val="toFexedStake(log.activatedStake)"
                        duration="3"></count-up>
                      &nbsp; BTG &nbsp; (
                      {{ countplount(log.activatedStake) }}
                      )
                    </td>
                    <td style="text-align: left">
                      {{ log.ip }}
                    </td>
                    <td style="text-align: left">
                      <span :style="{
                        color: log.activatedStake !== '' ? 'green' : 'yellow',
                      }" class="menu-icon">
                        <font-awesome-icon icon="fas fa-lg fa-fw me-2 fa-check-circle"
                          v-if="log.activatedStake !== ''" />
                        <font-awesome-icon icon="fas fa-lg fa-fw me-2 fa-question-circle"
                          v-if="log.activatedStake == ''" />
                      </span>
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="4">{{ $t("not_found") }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </card-body>
        </card>
      </div>
    </div>
    <div v-show="!shoeType">{{ $t("loading") }}</div>
  </div>
</template>


<script setup>
import { useAppStore } from "../../stores/index";
import { ref, getCurrentInstance ,watchEffect} from "vue";
import { useRouter } from "vue-router";
import CountUp from "vue-countup-v3";
import i18n from "@/i18n"

const router = useRouter();

const apps = getCurrentInstance()

const promaster = ref(apps?.proxy?.$progream);

const appStore = useAppStore();

const shoeType = ref(false);

const Vaildators = ref([
  {
    name: "validators.title",
    value: 0,
  },
  {
    name: "validators.weighted_skip_rate",
    value: 0,
  },
  {
    name: "validators.nominal_staking_apy",
    value: 0,
  },
  {
    name: "validators.node_versions",
    value: 0,
  },
]);

// 语言
function selectLanguage(indexValue){
  
  
  i18n.global.locale = indexValue;
}

watchEffect(()=>{
  selectLanguage(appStore.$state.language);
})

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
