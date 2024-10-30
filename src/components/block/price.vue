<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">{{ $t("dashboard.staking_apy") }}</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
             
            ">
            <h5 style="display: flex; height: 30px; font-size: 0.9rem;line-height: 30px;">{{ data == 'NaN' ? 0 : data }}%
            </h5>
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
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ $t(statInfo.language )}}  {{ statInfo.text }}</div>
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
import { onMounted, ref, watchEffect } from "vue";
import i18n from "@/i18n"
const appStore = useAppStore();
const data = ref();

const skate = ref();

const info = ref([]);
const stubly = ref(1);
const pubbley = ref(1);

// 语言
function selectLanguage(indexValue){
  
  
  i18n.global.locale = indexValue;
}
watchEffect(()=>{
  selectLanguage(appStore.$state.language);
})

onMounted(() => {
  // datavalue();
  watchEffect(() => {
    stubly.value = appStore.stubly;
    pubbley.value = appStore.pubbley;
    skateRequest()
  })
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
        language:"dashboard.daily_output",
        text:
          " " +
          formatNumber(((year / 365) * 1000000).toFixed(0)) +
          " " ,
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-skype",
        language:"dashboard.monthly_output",
        text: " " + (year / 12).toFixed(2) * 1000 + "K",
      },
      {
        icon: "fab fa-lg fa-fw me-2 fa-sellsy",
        language:"dashboard.annual_output",
        text: " " + year + "M",
      },
    ];
  });
};

const formatNumber = (value) => {
  const num = parseInt(value, 10);
  return new Intl.NumberFormat('en-US').format(num);
};

</script>
