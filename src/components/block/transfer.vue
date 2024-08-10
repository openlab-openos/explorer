<template>
  <div class="col-lg-6 col-xl-3" v-if="data.amount != undefined">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">24H Transfer</span>
          <card-expand-toggler />
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div
            style="
              width: 40%;
              display: flex;
              justify-content: space-between;
              height: 30px;
              line-height: 30px;
            "
          >
            <h5 style="display: flex; height: 30px">
              <numberAnimar :count="JSON.parse(data.amount)" />
              <div style="white-space: nowrap; line-height: 30px; height: 30px">
                &nbsp;BTG
              </div>
            </h5>
          </div>
          <div style="width: 20%">
            <div style="color: #339a81; font-size: 20px; margin-right: 10%">
              <i class="fas fa-lg fa-fw me-2 fa-exchange-alt"></i>
            </div>
          </div>
          <div style="width: 40%">
            <h5
              style="display: flex; line-height: 30px; width: 30%; height: 30px"
            >
              $
              <numberAnimar :count="data.amount * appStore.rate" />
            </h5>
          </div>
        </div>
        <div
          class="small text-inverse text-opacity-50 text-truncate"
          v-if="type"
        >
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
import numberAnimar from "../../components/CountFlop.vue";
import apexchart from "@/components/plugins/Apexcharts.vue";
import { order } from "../../request/order";
import { ustdData } from "../../request/ustd";
import { useAppStore } from "../../stores/index";
import { ref, watch } from "vue";

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
const supplyRequest = async () => {
  if (appStore.Transaction.length == 0) {
    await order("new_transactions")
      .then((res) => {
        for (let i in res) {
          transferData.value.push(res[i]);
        }
        rendered();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    transferData.value = appStore.Transaction;
    rendered();
  }
};


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

const rendered = () => {
  for (let i in transferData.value) {
    if (transferData.value[i].result.blockTime * 1000 > dataTime.value) {
      transactionData.value.push(transferData.value[i]);
    }
    priceTrans.value +=
      transactionData.value[
        i
      ].result.transaction.message.instructions[0].parsed.info.lamports;
  }
  info.value = [
    {
      icon: "fa fa-chevron-up fa-fw me-1",
      text: timeout() + " " + "Transactions 24 hours" + " ",
    },
    {
      icon: "far fa-hdd fa-fw me-1",
      text:
        toFexedStake(priceTrans.value / transactionData.value.length) +
        " " +
        "BTG" +
        " " +
        "Per Transaction",
    },
    {
      icon: "far fa-hand-point-up fa-fw me-1",
      text:
        (
          toFexedStake(priceTrans.value / transactionData.value.length) *
          appStore.rate
        ).toFixed(2) +
        " " +
        "USD Per Transaction",
    },
  ];
  type.value = true;
};

supplyRequest();
</script>
