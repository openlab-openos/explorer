<template>
  <div style="width: 100%">
    <h3 class="text-canter">Epoch</h3>
    <card class="md-3">
      <card-body class="card-bodys">
        <table v-if="blockType" class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
          <th>
          <td>Overview</td>
          <td class=" text-end"></td>
          </th>
          <tbody>
            <tr>
              <td>Epoch</td>
              <td class="text-end">{{ epoch }}</td>
            </tr>
            <tr>
              <td> Previous Epoch</td>
              <td class="text-end text-theme">{{ epoch - 1 }}</td>
            </tr>
            <tr v-if="epochrequest">
              <td>Next Epoch</td>
              <td class="text-end text-theme" style="cursor: pointer"> Epoch in progress </td>
            </tr>
            <tr>
              <td>First Slot</td>
              <td class="text-end text-theme" style="cursor: pointer" @click="blockSkip(block)"> <count-up duration="3"
                  :startVal="block" :end-val="block"></count-up> </td>
            </tr>
            <tr>
              <td>Last Slot</td>
              <td class="text-end text-theme" style="cursor: pointer" @click="blockSkip(lastBlock)"> <count-up
                  duration="3" :startVal="lastBlock" :end-val="lastBlock"></count-up> </td>
            </tr>
            <tr>
              <td>First Block Timestamp</td>
              <td class="text-end">
                {{ timestamp() }}
              </td>
            </tr>
            <tr>
              <td>First Block</td>
              <td class="text-end text-theme" style="cursor: pointer" @click="blockSkip(block)"> <count-up duration="3"
                  :startVal="block" :end-val="block"></count-up> </td>
            </tr>
            <tr>
              <td>Last Block Timestamp</td>
              <td class="text-end text-theme" style="cursor: pointer" v-if="epochrequest.epoch == epoch"> Epoch in
                progress
              </td>
              <td class="text-end text-theme" v-if="epochrequest.epoch != epoch" @click="epochSkip(progress(epoch))">
                {{ progress(epoch) }} </td>
            </tr>
          </tbody>
        </table>
      </card-body>
    </card>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { chainRequest } from "../../request/chain";
import CountUp from "vue-countup-v3";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const epoch = ref(route.params.num);

const blockType = ref(false);

const epochrequest = ref(null);

const block = ref(0);
const lastBlock = ref(0);
const blockTime = ref(0);

const EpochRequest = async () => {
  let requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getEpochInfo",
    params: [], // 如果需要的话
  };
  await chainRequest(requestBody)
    .then((response) => {
      epochrequest.value = response.result;
      block.value = response.result.blockHeight;
      lastBlock.value = block.value + response.result.slotsInEpoch - 1;

      blockType.value = true;
    })
    .catch((error) => {
      console.error("Error fetching epoch info:", error);
    });
  await chainRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "getBlockTime",
    params: [block.value], // 如果需要的话
  })
    .then((res) => {
      blockTime.value = res.result;
    })
    .catch((err) => {
      console.log(err);
    });
};
EpochRequest();
const epochSkip = (num) => {
  router
    .push({
      name: "epoch",
      params: {
        num: num,
      },
    })
    .then((res) => {

      location.reload();
    })
    .catch((err) => {
      console.err(err);
    });
};

const blockSkip = (num) => {
  router.push({
    name: "block",
    params: {
      url: num,
    },
  });
};

const progress = (num) => {

  return parseInt(num) + 1;
};

const timestamp = () => {
  return moment.unix(blockTime.value).format("YYYY-MM-DD HH:mm:ss");
};

window.addEventListener("popstate", (event) => {

  location.reload();
});
</script>
<style scoped>
table {
  width: 100%;
}
</style>