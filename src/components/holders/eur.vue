<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t("holder.title4") }}</span>
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
              {{ come(data.holders) }}
            </h5>
          </div>
          <div
            style="
              width: 40%;
              height: 30px;
              display: flex;
              justify-content: center;
            "
          >
            <img :src="eurImage" width="60" height="60" alt="" />
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

import eurImage from '../../assets/holders/EUR.png';
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
      data.value = res.token[1];
    });

    info.value = [
      {
        icon: ["fas", "chevron-up"],
        language: "holder.btg_locked",
        text: come(smartFormatNumber(data.value.btg_amount))+ " BTG",
      },
      {
        icon: ["far", "hdd"],
        language: "holder.circulating_supply",
        text: come(
          smartFormatNumber(
            data.value.supply /
              10 ** (data.value.decimals ? data.value.decimals : 0),
          ),
        ) + " EUR",
      },
      {
        icon: ["far", "hand-point-up"],
        language: "holder.mc",
        text: come(
          smartFormatNumber(
            data.value.market_cap /
              10 ** (data.value.decimals ? data.value.decimals : 0),
          ),
        ) + " USD",
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
  // if (!num && num !== 0) return ""; // 兼容num为0的情况

  // let resultStr = "";
  // const numStr = num.toString();
  // const isHasDecimal = numStr.indexOf(".") > -1;
  // // 先转换为数字类型（避免字符串数字计算异常）
  // const originalNum = Number(num);

  // // 步骤1：判断是否需要以M（百万）简略（小数点前整数部分>6位）
  // // 提取整数部分长度（兼容有小数的情况）
  // const integerPartLen = isHasDecimal
  //   ? numStr.split(".")[0].length
  //   : numStr.length;

  // if (integerPartLen > 6) {
  //   // 转换为百万单位（÷1000000），保留2位小数（可调整）
  //   const simplifiedNum = (originalNum / 1000000).toFixed(2);
  //   // 拼接M后缀，自动去除末尾多余的.00
  //   resultStr = simplifiedNum.replace(/\.00$/, "") + "M";
  // } else {
  //   // 无需简略，直接使用原始数字字符串
  //   resultStr = numStr;
  // }

  // // 步骤2：千分位逗号分隔格式化（兼容带M后缀的场景）
  // // 拆分M后缀（避免正则匹配到M后面的字符）
  // const hasMSuffix = resultStr.includes("M");
  // let numPart = resultStr;
  // let suffix = "";
  // if (hasMSuffix) {
  //   const splitArr = resultStr.split("M");
  //   numPart = splitArr[0];
  //   suffix = "M";
  // }

  // // 原有千分位格式化正则
  // const reg =
  //   numPart.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;

  // // 格式化数字部分后，拼接M后缀
  // const formattedNumPart = numPart.replace(reg, "$1,");
  // return formattedNumPart + suffix;
};
</script>
