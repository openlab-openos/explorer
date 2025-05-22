<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t('transaction.transfer_amount') }}</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 45%;
              display: flex;
              justify-content: space-between;
              height: 30px;
              line-height: 30px;
            ">
            <h5 style="display: flex; height: 30px">
              <numberAnimar :count="data.amount ? JSON.parse(data.amount) : 0" />
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
          <div style="width: 35%;height: 30px;display: flex;justify-content: end;">
            <h5 style="line-height: 30px; font-size:0.9rem;">
              $
            </h5>
            <h5 style="display: flex; height: 30px;">
              <numberAnimar :count="data.amount ? data.amount * appStore.rate : 0" />
            </h5>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate" v-if="type">
          <template v-for="statInfo in info">
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ $t(statInfo.language) }} {{ statInfo.text }} </div>
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
import i18n from "@/i18n";

const appStore = useAppStore();

const data = ref({});
const dataRequest = async () => {
  await order("amount_per_day").then((res) => {
    data.value = res;
  });
};
dataRequest();
// 语言
function selectLanguage(indexValue) {


  i18n.global.locale = indexValue;
}
watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

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
        transferData.value[transferData.value.length - 1].blockTime)
    ).toFixed(0) * transferData.value.length
  );
};

const toFexedStake = (num) => {
  console.log(num);
  
  if (typeof num == "number" && num !='Infinity' ) {
    return JSON.parse((num / 1000000000).toFixed(2));
  } else {
    return 0;
  }
};
const info = ref();
const type = ref(false);

const rendered = (data) => {

  if (data.length !== 0) {
    for (let i in data) {
      if (data[i].blockTime * 1000 > dataTime.value) {
        data.push(data[i]);
      }
      if (data[i].uiAmount) {
        priceTrans.value +=
          data[i].uiAmount
      }
    }
  }

  info.value = [
    {
      icon: "fas fa-lg fa-fw me-2 fa-euro-sign",
      text: timeout() + " ",
      language: "dashboard.transactions"
    },
    {
      icon: "fas fa-lg fa-fw me-2 fa-won-sign",
      text:
        toFexedStake(priceTrans.value / data.length) +
        " " +
        "BTG" +
        " ",
      language: "dashboard.per_transaction"

    },
    {
      icon: "fas fa-lg fa-fw me-2 fa-yen-sign",
      text:
        (
          toFexedStake(priceTrans.value / data.length) *
          appStore.rate
        ).toFixed(2) +
        " USD",
      language: "dashboard.per_transactions"
    },
  ];

};

onMounted(() => {
  watchEffect(() => {
    console.log(JSON.parse(appStore.Transaction));
    let dataArray = [];
    if (appStore.Transaction.length != 0) {
      for (let i in JSON.parse(appStore.Transaction)) {
        transferData.value.push(
          JSON.parse(appStore.Transaction)[i]
        )
      }
      let data = JSON.parse(appStore.Transaction);
      if (data.length != 0) {

        for (let i in data) {
          let etach = data[i];

          // return;
          if (etach.type == "transfer") {
            dataArray.push(data[i])
          }


        }
        console.log(dataArray);

        if (dataArray.length != 0) {
          rendered(dataArray);
        }

      }

    }
    rendered(dataArray);
    type.value = true;

  })
})

</script>
