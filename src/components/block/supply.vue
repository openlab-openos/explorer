<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">BTG {{ $t("dashboard.supply") }} </span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 45%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">

            <h5 style="display: flex; height: 30px ;font-size:0.9rem;">
              <span class="supplyText">
                <numberAnimar :count="data ? JSON.parse(data) : 0" />
              </span>
              <span class="supply-text">
                {{
                  formatNumberToMillion(data ? JSON.parse(data) : 0)
                }}
              </span>
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

          <div style="width: 35%;line-height: 30px;display: flex;justify-content: end; font-size:0.9rem;">
            <h5 style="line-height: 30px;">
              $
            </h5>
            <h5 style="display: flex;height: 30px;  font-size:0.9rem;
">
              <span class="supplyText">
                <numberAnimar :count="data ? data * appStore.rate : 0" />
              </span>
              <span class="supply-text">
                {{
                  formatNumberToMillion(data ? data * appStore.rate : 0)
                }}
              </span>
            </h5>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ $t(statInfo.language) }}  {{ statInfo.text }}{{ $t(statInfo.unit) }} </div>
          </template>
        </div>
      </card-body>
    </card>
    <!-- END card -->
  </div>
</template>

<script setup>
import numberAnimar from "../../components/CountFlop.vue";
import { useAppStore } from "../../stores/index";
import { onMounted, ref, watchEffect } from "vue";
import i18n from "@/i18n";


const appStore = useAppStore();

const data = ref();

const convert = ref(0);

const info = ref([]);

// 语言
function selectLanguage(indexValue){
  
  
  i18n.global.locale = indexValue;
}
watchEffect(()=>{
  selectLanguage(appStore.$state.language);
})

onMounted(() => {
  watchEffect(() => {
    data.value = JSON.stringify(appStore.stuBlys).slice(0, 9);
    info.value = [
      {
        icon: "fas fa-lg fa-fw me-2 fa-dollar-sign",
        text: "200",
        language:"dashboard.total",
        unit:"dashboard.million"
      },
      {
        icon: "fas fa-lg fa-fw me-2 fa-database",
        text: "100",
        language:"dashboard.mining_allocation_of_total",
        unit:"dashboard.million"
      },
      {
        icon: "fas fa-lg fa-fw me-2 fa-cubes",
        text:
          ((JSON.parse(data.value) - 100000000)/1000000).toFixed(2) +
          "M", 
        language:"dashboard.supplied_output",
        unit:""
      },
    ];
  })
})



const formatNumber = (value) => {
  const num = parseInt(value, 10);
  return new Intl.NumberFormat('en-US').format(num);
};

function formatNumberToMillion(num) {
  // 将数字除以一百万  
  const million = num / 1000000;

  // 转换为固定小数点的字符串，这里以两位小数为例  
  // 你可以根据需要调整小数点后的位数  
  const formatted = million.toFixed(2);

  // 添加“M”后缀  
  return `${formatted}M`;
}
</script>

<style scopend>
.supply-text {
  display: none;
  line-height: 30px;
}

.supplyText {
  display: block;
}

@media(max-width: 1600px) {
  .supply-text {
    display: block;
  }

  .supplyText {
    display: none;
  }
}
</style>