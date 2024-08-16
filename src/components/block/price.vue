<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">Staking APY</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
             
            ">
            <h5 style="display: flex; height: 30px; font-size: 0.9rem;line-height: 30px;">{{ data }}%</h5>
          </div>

          <div style="
              width: 40%;
              color: #3cd2a5;
              font-size: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 30px;
            ">
            <i class="bi bi-credit-card fa-fw fa-lg"></i><br />
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


<script setup>
import { chainRequest } from "../../request/chain";
import { useAppStore } from "../../stores/index";
import { onMounted, ref } from "vue";

const appStore = useAppStore();
const data = ref();

const skate = ref();

const info = ref([]);
const stubly = ref();
const pubbley = ref();

const datavalue = async () => {
  if (appStore.stubly == 0) {
    await chainRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "getSupply",
    }).then((res) => {
      stubly.value = (
        JSON.parse(JSON.stringify(res.result.value.total).slice(0, 9)) / 1000000
      ).toFixed(1);
    })
    await chainRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "getVoteAccounts",
      params: [],
    })
      .then((res) => {
        let btg = res.result;
        let btgcont = 0;
        if (btg) {
          for (let i in btg.current) {
            btgcont += JSON.parse(JSON.stringify(btg.current[i].activatedStake));
          }
          let num = (btgcont / 1000000000).toFixed(0);
          btgcont = (num / 1000000).toFixed(1);
        }
        pubbley.value = btgcont;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    stubly.value = appStore.stubly;
    pubbley.value = appStore.pubbley;
  }
  skateRequest()
}
onMounted(() => {
  datavalue();
})
const skateRequest = async () => {
  await chainRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "getInflationRate",
  }).then((res) => {
    skate.value = res.result;
    console.log(stubly.value, pubbley.value);
    data.value = (
      (JSON.parse(stubly.value) / JSON.parse(pubbley.value)) *
      skate.value.validator *
      100
    ).toFixed(2);
    appStore.getStakeData(data.value);
    let year = (stubly.value * skate.value.validator).toFixed(2);
    info.value = [
      {
        icon: "fab fa-lg fa-fw me-2 fa-speakap",
        text:
          "Daily output" +
          " " +


          formatNumber(((year / 365) * 1000000).toFixed(0)) +
          " " +
          "BTG",
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-skype",
        text: "Monthly output" + " " + (year / 12).toFixed(2) * 1000 + "K",
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-sellsy",
        text: "Annual output" + " " + year + "M",
      },
    ];
  });
};

const formatNumber = (value) => {
  const num = parseInt(value, 10);
  return new Intl.NumberFormat('en-US').format(num);
};

</script>
