<template>
  <div style="display: flex" >
    <img
      v-if="titleUrl(paramsId).type && propsType"
      :src="titleUrl(paramsId).img"
      height="20"
      class="marginRight10"
    />
    <!-- <text v-if="propsType" style="cursor: pointer" @click="pubbtx(paramsId)" class="marginRight10">
            {{ props.transactionType ? (titleUrl(paramsId).url ? titleUrl(paramsId).url : 'N/A') :
                (stringcate(paramsId)) }}
        </text> -->
        
    <span
      v-if="
        isNumber(paramsId) && paramsId !== '11111111111111111111111111111111'
      "
    >
      <!-- {{ paramsId }} -->
    </span>
    <div v-else>
      <router-link
        v-if="propsType && paramsId != blackAddress"
        :style="'color:' + propsColor"
        :to="{ name: 'address', params: { url: paramsId } }"
        >{{
          props.transactionType
            ? titleUrl(paramsId).url
              ? titleUrl(paramsId).url
              : "N/A"
            : stringcate(paramsId)
        }}</router-link
      >

      <router-link
        v-if="propsType && paramsId == blackAddress"
        :style="'color:' + propsColor"
        :to="{ name: 'blackhole' }"
        >{{
          props.transactionType
            ? titleUrl(paramsId).url
              ? titleUrl(paramsId).url
              : "N/A"
            : stringcate(paramsId)
        }}</router-link
      >
    </div>

    <img
      v-if="titleUrl(paramsId).type && titleUrl(paramsId).assest"
      v-for="(datas, indexs) in titleUrl(paramsId).certificates"
      :key="indexs"
      :src="datas.img"
      height="20"
      class="marginRight8"
      alt=""
      @click="pubbley"
      style="cursor: pointer"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { useRouter } from 'vue-router';

// import blackAddress from '../../components/blackAddress.js';
import blackAddress from '../blackAddress.js';
import { titleUrl } from '../method/title_url';

const props = defineProps({
  address: {
    type: String,
    default: "",
  },
  type: {
    default: true,
    typeof: Boolean,
  },
  transactionType: {
    default: true,
    typeof: Boolean,
  },
  color: {
    type: String,
    default: "",
  },
});
const router = useRouter();

const paramsId = ref(props.address);

const propsType = ref(props.type);
const propsColor = ref(props.color);

const isNumber = (value) => {
  // 排除 null/undefined/空字符串，同时校验是否为有效数字
  if (value === null || value === undefined || value === "") return false;
  // 方式1：正则校验（推荐，兼容字符串数字如 "123"、"-456"、"789.01"）
  return /^-?\d+(\.\d+)?$/.test(String(value).trim());
  // 方式2：类型校验（仅针对纯数字类型 number，不兼容字符串格式数字）
  // return typeof value === 'number' && !isNaN(value);
};

const pubbley = () => {
  router.push({
    name: "TokenReputation",
  });
};

const stringcate = (str) => {
  if (str) {
    if (str.length < 10) {
      return str;
    } else {
      return str.slice(0, 5) + "..." + str.slice(-5);
    }
  } else {
    return "N/A";
  }
};
</script>
