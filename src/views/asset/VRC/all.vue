<template>
  <card class="md-3">
    <card-body class="card-bodys">
      <div class="d-flex fw-bold small mb-3">
        <span class="flex-grow-1"> {{ $t("navigation.tokens") }} </span>
      </div>
      <assets-list v-if="historyData.length > 0" :data="historyData" />
      <div v-else class="text-center">
        <loading-vue v-if="true" />
      </div>
    </card-body>
  </card>
</template>

<script setup>
import {
  computed,
  ref,
  watchEffect,
} from 'vue'; //

import { tokenList } from '../asset';
import assetsList from '../componects/ProgramList.vue';

const historyData = ref([]);

watchEffect(async () => {
  try {
    const assets = await tokenList(1, 200);
    let data = assets.data;
    const status1Items = data.filter((item) => item.status === 1);
    const nonStatus1Items = data.filter((item) => item.status !== 1);

    // 重组为新数组（可根据需求调整顺序）
    const newArray = [
      ...status1Items, // status为1的元素放在前面
      ...nonStatus1Items, // status不为1的元素放在后面
    ];

    historyData.value = newArray;
  } catch (error) {
    console.error("Error in watchEffect:", error);
  }
});
</script>
