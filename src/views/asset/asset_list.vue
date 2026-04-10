<template>
  <div v-if="loadingType">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :label="$t('account.All')" name="first">
        <allList />
      </el-tab-pane>
      <el-tab-pane :label="$t('navigation.bitcurrency')" name="second">
        <Vrc10List />
      </el-tab-pane>
      <el-tab-pane :label="$t('navigation.privcurrency')" name="third">
        <Vrc11List />
      </el-tab-pane>
      <el-tab-pane :label="$t('navigation.bitsecurity')" name="fourth">
        <Vrc12List />
      </el-tab-pane>
    </el-tabs>
  </div>
  <div v-else>
    <loading-vue />
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from 'vue';

import { useRoute } from 'vue-router';

import { useAppStore } from '@/stores/index';

import LoadingVue from '../../components/block/loading.vue';
import allList from './VRC/all.vue';
import Vrc10List from './VRC/bitcurrency.vue';
import Vrc12List from './VRC/bitsecurity.vue';
import Vrc11List from './VRC/privcurrency.vue';

const appStore = useAppStore();
const route = useRoute();

const loadingType = ref(false);

watch(
  () => appStore.activeTab,
  (newVal) => {
    console.log("activeTab changed:", newVal);
  },
);

watch(
  () => route.fullPath,
  () => {
    console.log("Route changed, keeping current tab");
  },
);

const tabMapping: Record<string, string> = {
  Bitcurrency: "second",
  Privcurrency: "third",
  Bitsecurity: "fourth",
  All: "first",
};

const reverseMapping: Record<string, string> = {
  second: "Bitcurrency",
  third: "Privcurrency",
  fourth: "Bitsecurity",
  first: "All",
};

const activeName = computed({
  get: () => {
    const tab = appStore.activeTab;
    return tabMapping[tab] || tab;
  },
  set: (value) => {
    appStore.activeTab = reverseMapping[value] || value;
  },
});

function handleClick(tab: any) {
  console.log("tab clicked:", tab);
}

loadingType.value = true;
</script>

<style scoped>
a {
  text-decoration: none;
}

#buyD {
  color: rgba(0, 255, 179, 1);
}

#buyC {
  color: rgba(255, 215, 39, 1);
}

.backStyle {
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 6px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
  margin-right: 3px;
}

.a-Link {
  margin-left: 1px;
  margin-bottom: 1px;
  font-family: Gilroy;
}
</style>

<style scoped>
::v-deep .el-tabs__item {
  background-color: rgba(255, 255, 255, 0.08);
  margin-left: 10px;
  text-align: center;
  padding: 0 !important;
  padding: 0 12px !important;
  border-radius: 10px;
  box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.08);
  color: #fff;
}
::v-deep .el-tabs__nav-wrap:after {
  display: none !important;
}
::v-deep .el-tabs__item.is-active {
  color: #3cd2a5 !important;
}
::v-deep .el-tabs__active-bar {
  background-color: #3cd2a5 !important;
}
</style>
