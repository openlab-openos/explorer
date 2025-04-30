<template>
  <div style="width: 100%" v-if="loading">
    <h3> {{ $t("epoch") }} </h3>
    <card class="md-3">
      <card-body class="card-bodys">
        <table v-if="blockType" class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
          <thead>
            <tr>
              <td>{{ $t("transaction.overview") }}</td>
              <td class="text-end"></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ $t("epoch") }} </td>
              <td class="text-end">{{ epoch }}</td>
            </tr>
            <tr>
              <td> {{ $t("epoch_page.previous_epoch") }} </td>
              <td class="text-end text-theme">{{ epoch - 1 }}</td>
            </tr>
            <tr v-if="epochrequest">
              <td> {{ $t("epoch_page.next_slot") }} </td>
              <td class="text-end text-theme" style="cursor: pointer">Epoch in progress</td>
            </tr>
            <tr>
              <td> {{ $t("epoch_page.first_slot") }} </td>
              <td class="text-end text-theme" style="cursor: pointer" @click="blockSkip(block)">
                <count-up duration="3" :startVal="block" :end-val="block"></count-up>
              </td>
            </tr>
            <tr>
              <td> {{ $t("epoch_page.last_slot") }} </td>
              <td class="text-end text-theme" style="cursor: pointer" @click="blockSkip(lastBlock)">
                <count-up duration="3" :startVal="lastBlock" :end-val="lastBlock"></count-up>
              </td>
            </tr>
            <tr>
              <td> {{ $t("epoch_page.first_block_timestamp") }} </td>
              <td class="text-end">{{ timestamp() }}</td>
            </tr>
            <tr>
              <td> {{ $t("epoch_page.first_block") }} </td>
              <td class="text-end text-theme" style="cursor: pointer" @click="blockSkip(block)">
                <count-up duration="3" :startVal="block" :end-val="block"></count-up>
              </td>
            </tr>
            <tr>
              <td> {{ $t("epoch_page.last_block") }} </td>
              <td class="text-end text-theme" v-if="epochrequest.epoch == epoch">Epoch in progress</td>
              <td class="text-end text-theme" v-if="epochrequest.epoch != epoch" @click="epochSkip(progress(epoch))">
                {{ progress(epoch) }}
              </td>
            </tr>
          </tbody>
        </table>
      </card-body>
    </card>
  </div>
  <div v-else>
    <loading-vue />
  </div>
</template>

<script setup>
import { onMounted, ref,watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { chainRequest } from "../../request/chain";
import CountUp from "vue-countup-v3";
import moment from "moment";
import { useAppStore } from "../../stores/index";
import LoadingVue from "../../components/block/loading.vue";
import i18n from "@/i18n"

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const epoch = ref(route.params.num);
const loading = ref(false);
const blockType = ref(false);
const epochrequest = ref(null);
const block = ref(0);
const lastBlock = ref(0);
const blockTime = ref(0);

// 语言
function selectLanguage(indexValue){
  i18n.global.locale = indexValue;
}

watchEffect(()=>{
  selectLanguage(appStore.$state.language);
})
const EpochRequest = async () => {
  try {
    const response =appStore.getepochInfo;
    epochrequest.value = response;
    block.value = response.blockHeight;
    lastBlock.value = block.value + response.slotsInEpoch - 1;
    blockType.value = true;
    loading.value = true;

    const blockTimeResponse = await chainRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "getBlockTime",
      params: [block.value],
    });
    blockTime.value = blockTimeResponse.result;
  } catch (error) {
    console.error("Error fetching epoch info:", error);
  }
};

onMounted(() => {
  EpochRequest();
});

const epochSkip = (num) => {
  router.push({ name: "epoch", params: { num: num } })
    .then(() => location.reload())
    .catch((err) => console.error(err));
};

const blockSkip = (num) => {
  router.push({ name: "block", params: { url: num } });
};

const progress = (num) => {
  return parseInt(num) + 1;
};

const timestamp = () => {
  return moment.unix(blockTime.value).format("YYYY-MM-DD HH:mm:ss");
};

// Handle browser back navigation
window.addEventListener("popstate", () => {
  location.reload();
});
</script>

<style scoped>
table {
  width: 100%;
}
</style>