<template>
  <div class="col-lg-6 col-xl-3 minification">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 175px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t("holder.title2") }}</span>
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
            <img :src="usdImage" width="60" height="60" alt="" />
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

import usdImage from '../../assets/holders/usd.png';
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
      data.value = res.token[0];
    });

    info.value = [
      {
        icon: ["fas", "chevron-up"],
        language: "holder.btg_locked",
        text: come(smartFormatNumber(data.value.btg_amount)),
      },
      {
        icon: ["far", "hdd"],
        language: "holder.circulating_supply",
        text: come(
          smartFormatNumber(
            data.value.supply /
              10 ** (data.value.decimals ? data.value.decimals : 0),
          ),
        ) + " BTG",
      },
      {
        icon: ["far", "hand-point-up"],
        language: "holder.mc",
        text:
          come(
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

  // // 步骤1：提取整数部分长度（兼容有小数的情况）
  // const integerPartLen = isHasDecimal
  //   ? numStr.split(".")[0].length
  //   : numStr.length;

  // // 步骤2：按位数判断用B（十亿）/M（百万）/原数字
  // if (integerPartLen > 9) {
  //   // 整数部分>9位（≥10亿）：转换为十亿单位（÷1000000000），保留2位小数
  //   const simplifiedNum = (originalNum / 1000000000).toFixed(2);
  //   // 拼接B后缀，自动去除末尾多余的.00
  //   resultStr = simplifiedNum.replace(/\.00$/, "") + "B";
  // } else if (integerPartLen > 6) {
  //   // 整数部分>6位且≤9位（≥100万且＜10亿）：转换为百万单位
  //   const simplifiedNum = (originalNum / 1000000).toFixed(2);
  //   resultStr = simplifiedNum.replace(/\.00$/, "") + "M";
  // } else {
  //   // 整数部分≤6位：无需简略，直接使用原始数字字符串
  //   resultStr = numStr;
  // }

  // // 步骤3：千分位逗号分隔格式化（兼容带M/B后缀的场景）
  // // 拆分后缀（M/B），避免正则匹配到后缀字符
  // const hasSuffix = resultStr.includes("M") || resultStr.includes("B");
  // let numPart = resultStr;
  // let suffix = "";
  // if (hasSuffix) {
  //   // 提取数字部分和后缀（M/B）
  //   const mbIndex =
  //     resultStr.indexOf("M") > -1
  //       ? resultStr.indexOf("M")
  //       : resultStr.indexOf("B");
  //   numPart = resultStr.substring(0, mbIndex);
  //   suffix = resultStr.substring(mbIndex);
  // }

  // // 千分位格式化正则（仅处理数字部分）
  // const reg =
  //   numPart.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;

  // // 格式化数字部分后，拼接后缀
  // const formattedNumPart = numPart.replace(reg, "$1,");
  // return formattedNumPart + suffix;
};
</script>
