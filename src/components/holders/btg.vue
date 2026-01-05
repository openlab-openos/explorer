<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t("holder.title1") }}</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div
            style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            "
          >
            <h5
              style="
                display: flex;
                height: 30px;
                font-size: 0.9rem;
                line-height: 30px;
              "
            >
              {{ come(data.total) }}
            </h5>
          </div>
          <div style="width: 40%; height: 30px;display: flex;justify-content: center;">
            <img :src="btgImage" width="60" height="60" alt="">
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <div>
              <font-awesome-icon :icon="statInfo.icon" />
              {{ $t(statInfo.language) }} {{ statInfo.text }}
            </div>
          </template>
        </div>
      </card-body>
    </card>
    <!-- END card -->
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  watchEffect,
} from 'vue';

import apexchart from '@/components/plugins/Apexcharts.vue';
import i18n from '@/i18n';
import { useAppVariableStore } from '@/stores/app-variable';

import btgImage from '../../assets/holders/btg.png';
import numberAnimar from '../../components/CountFlop.vue';
import { smartFormatNumber } from '../../components/number/smart';
import { chainRequest } from '../../request/chain';
import { useAppStore } from '../../stores/index';
import { dataObject } from './request/api';

const appStore = useAppStore();

const appVariable = useAppVariableStore();

const stubly = ref(1);
const data = ref(1);
const epoch = ref(1);
const info = ref();

// 语言
function selectLanguage(indexValue) {
  i18n.global.locale = indexValue;
}
watchEffect(() => {
  selectLanguage(appStore.$state.language);
});

const randomNo = () => {
  return Math.floor(Math.random() * 60) + 30;
};
const requestType = ref(true);
onMounted(() => {
  watchEffect(async () => {
    await dataObject().then((res) => {
      console.log(res);
      data.value = res.btg_holders;
    });
    // if (requestType.value) {
    //   requestType.value = false;
    //   epoch.value = appStore.network
    //   await chainRequest({
    //     jsonrpc: "2.0",
    //     id: 1,
    //     method: "getVoteAccounts",
    //     params: [],
    //   }).then((res) => {
    //     let btg = res.result;
    //     let btgcont = 0;
    //     let btgcount = 0;

    //     if (btg) {
    //       for (let i in btg.current) {
    //         btgcont += JSON.parse(JSON.stringify(btg.current[i].activatedStake));
    //       }
    //       btgcount = btgcont;

    //       let num = (btgcont / 1000000000).toFixed(0);
    //       btgcont = (num / 1000000).toFixed(1);
    //     }
    //     data.value = btgcont;
    //     appStore.setPubbley(data.value);
    //     appStore.setBtgcount(btgcount);
    //     appStore.setVoteAccount(res);
    //   }).catch((err) => {
    //     // console.log(err);
    //     data.value = 0;
    //   });

    //   // data.value = appStore.pubbley;

    // }

    stubly.value = appStore.stubly;

    info.value = [
      {
        icon: ["fas", "chevron-up"],
        language: "holder.24H",
        text: come(data.value.growth_7d),
      },
      {
        icon: ["far", "hdd"],
        language: "holder.7D",
        text: come(data.value.growth_24h),
      },
      {
        icon: ["far", "hand-point-up"],
        language: "holder.30D",
        text: come(data.value.growth_30d),
      },
    ];
  });
});

const come = (num) => {
  if (num) {
    const reg =
      num.toString().indexOf(".") > -1
        ? /(\d)(?=(\d{3})+\.)/g
        : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
  }
};
</script>
