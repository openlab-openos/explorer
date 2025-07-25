<template>
  <div class="blocks" v-cloak>
    <div class="blocks-left">
      <div>
        <h4> {{ $t("blocks.title") }} </h4>
      </div>
      <div class="row">
        <div class="col-xl-3 col-lg-6" v-for="(stat, index) in block" :key="stat">
          <card class="mb-3">
            <card-body>
              <div class="d-flex fw-bold small mb-3">
                <span class="flex-grow-1">{{ $t(stat.name) }} </span>
              </div>
              <h5 class="text-theme" style="display: flex">
                <count-up :startVal="initial[index].value" :end-val="stat.value" duration="2"
                  :decimalPlaces="index == 3 ? 1 : 0"></count-up>
                <span v-show="stat.type"> {{ index == 3 ? "%" : "ms" }}</span>
              </h5>
            </card-body>
          </card>
        </div>
      </div>
      <div class="row" style="padding: 0px 10px">
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
                  <td>{{ $t("blocks.cluster_time") }}</td>
                  <td style="text-align: right">
                    {{ cluster }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $t("blocks.slot_time") }} (1min average)</td>
                  <td style="text-align: right">400ms</td>
                </tr>
                <tr>
                  <td>{{ $t("blocks.slot_time") }} (1hr average)</td>
                  <td style="text-align: right">400ms</td>
                </tr>
                <tr>
                  <td> {{ $t('epoch') }} </td>
                  <td style="text-align: right;" class="text-theme">
                    <text style=" cursor: pointer" @click="epochSkip(epoch)"> {{ epoch }}</text>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t("blocks.epoch_progress") }} </td>
                  <td style="text-align: right" class="text-theme">
                    {{ progress }}%
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('epoch_time_remaining') }}(approx.)</td>
                  <td style="text-align: right" v-if="time">
                    {{ time }}
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
} from 'vue';

import moment from 'moment';
import CountUp from 'vue-countup-v3';
import { useRouter } from 'vue-router';

import i18n from '@/i18n';

import numberAnimar from '../../components/CountFlop.vue';
import { chainRequest } from '../../request/chain';
import { useAppStore } from '../../stores/index';

const router = useRouter();
const appStore = useAppStore();
const block = ref([
  { name: "blocks.slot", value: 0, type: false },
  { name: "dashboard.block_height", value: 0, type: false },
  { name: "blocks.slot_time", value: 400, type: true },
  { name: "blocks.epoch_progress", value: 0, type: true },
]);

const initial = ref([
  { name: "blocks..slot", value: 0 },
  { name: "dashboard.block_height", value: 0 },
  { name: "blocks.slot_time", value: 0 },
  { name: "blocks.epoch_progress", value: 0 },
]);

const cards = ref([]);
const setInter = ref(null);
const epoch = ref(0);
const time = ref({
  day: 0,
  hours: 0,
  minutes: 0,
  remainingSeconds: 0,
});
const progress = ref("0%");
const cluster = ref(null);


// 语言
function selectLanguage(indexValue) {
  i18n.global.locale = indexValue;
}

watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

const getBlock = async (requestBody) => {
  try {
    const result = await chainRequest(requestBody);
    initial.value[0].value = block.value[0].value;
    initial.value[1].value = block.value[1].value;
    block.value[1].value = result.result.blockHeight;
    block.value[0].value = result.result.absoluteSlot;
    cards.value = [];
    epoch.value = result.result.epoch;
    time.value = getTime(result.result.slotsInEpoch - result.result.slotIndex);
    let d = new Date();
    cluster.value = moment(d).utc().format();
    progress.value = ((result.result.slotIndex / result.result.slotsInEpoch) * 100).toFixed(1);
    block.value[3].value = progress.value;

    for (let i = 0; i < 5; i++) {
      let count = JSON.parse(block.value[0].value) - i;
      cards.value.push({ number: count });
    }
  } catch (err) {
    // console.log(err);
  }
};

const getTime = (timestamp) => {
  return moment(JSON.parse(moment().format("x")) + timestamp * 400).fromNow();
};

const epochSkip = (num) => {
  // 使用 router 进行导航
  // 这里需要根据你的路由设置进行调整
  router.push({ name: "epoch", params: { num: num } });
};

onMounted(async () => {
  const request = {
    id: 2,
    jsonrpc: "2.0",
    method: "getEpochInfo",
    params: [],
  };
  await getBlock(request);
  setInter.value = setInterval(() => {
    getBlock(request);
  }, 2000);
});

onUnmounted(() => {
  clearInterval(setInter.value);
});
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
