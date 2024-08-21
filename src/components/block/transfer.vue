<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">24H Transfer Amount</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 45%;
              display: flex;
              justify-content: space-between;
              height: 30px;
              line-height: 30px;
            " v-if="data.amount != undefined">
            <h5 style="display: flex; height: 30px">
              <numberAnimar :count="JSON.parse(data.amount)" />
              <div style="white-space: nowrap; line-height: 30px; height: 30px; font-size:0.9rem;">
                &nbsp;BTG
              </div>
            </h5>
          </div>
          <div style="width: 20%;text-align: center;">
            <div style="color: #339a81; font-size: 20px;">
              <font-awesome-icon icon="fas fa-lg fa-fw me-2 fa-exchange-alt" />
            </div>
          </div>
          <div style="width: 35%;height: 30px;display: flex;justify-content: end;" v-if="data.amount != undefined">
            <h5 style="line-height: 30px; font-size:0.9rem;">
              $
            </h5>
            <h5 style="display: flex; height: 30px;">
              <numberAnimar :count="data.amount * appStore.rate" />
            </h5>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate" v-if="type">
          <template v-for="statInfo in info">
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ statInfo.text }}</div>
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
import { order } from "../../request/order";
import { useAppStore } from "../../stores/index";
import { onMounted, ref, watchEffect } from "vue";

const appStore = useAppStore();

const data = ref({});
const dataRequest = async () => {
  await order("amount_per_day").then((res) => {
    data.value = res;
  });
};
dataRequest();

const transferData = ref([]);

const transactionData = ref([]);

const transactions = ref(0);

const now = new Date();
const dataTime = ref(24 * 60 * 60);

const priceTrans = ref(1);

const timeout = () => {
  return (
    (
      dataTime.value /
      ((now.getTime() / 1000).toFixed(0) -
        transferData.value[transferData.value.length - 1].result.blockTime)
    ).toFixed(0) * transferData.value.length
  );
};

const toFexedStake = (num) => {
  if (num) {
    return JSON.parse((num / 1000000000).toFixed(2));
  }
};
const info = ref();
const type = ref(false);

const rendered = (data) => {
  for (let i in transferData.value) {
    if (transferData.value[i].result.blockTime * 1000 > dataTime.value) {
      data.push(transferData.value[i]);
    }
    priceTrans.value +=
      data[
        i
      ].result.transaction.message.instructions[0].parsed.info.lamports;
  }
  info.value = [
    {
      icon: "fas fa-lg fa-fw me-2 fa-euro-sign",
      text: timeout() + " " + "Transactions 24 hours" + " ",
    },
    {
      icon: "fas fa-lg fa-fw me-2 fa-won-sign",
      text:
        toFexedStake(priceTrans.value / data.length) +
        " " +
        "BTG" +
        " " +
        "Per Transaction",
    },
    {
      icon: "fas fa-lg fa-fw me-2 fa-yen-sign",
      text:
        (
          toFexedStake(priceTrans.value / data.length) *
          appStore.rate
        ).toFixed(2) +
        " " +
        "USD Per Transaction",
    },
  ];
  type.value = true;
};

onMounted(() => {
  watchEffect(() => {
    if (appStore.Transaction.length != 0) {
      for (let i in JSON.parse(appStore.Transaction)) {
        transferData.value.push(
          JSON.parse(appStore.Transaction)[i]
        )
      }
      let data = JSON.parse(appStore.Transaction);


      if (data.length != 0) {
        rendered(data);
      }
    }


  })
})

</script>
