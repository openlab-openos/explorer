<script setup>
import { getCurrentInstance, ref, watchEffect, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { chainRequest } from "../../request/chain";
import LoadingVue from "../../components/block/loading.vue"
import { solanapubbleys } from "../../components/method/solana"
import accountView from "./adress/account.vue"
import TokenView from "./adress/token.vue"
import TokenAccountView from "./adress/token_account.vue"

const route = useRoute();

const url = ref(route.params.url);

const loading = ref(false);
const typeAddress = ref();
const programId = ref()
const loadTypeAddress = async () => {
  try {

    typeAddress.value = await solanapubbleys(route.params.url);
    if (!typeAddress.value) {
      typeAddress.value = "address";

    } else {
      22222
    }
  } catch (error) {
    typeAddress.value = "address";
  }
};


const getInfo = async (url) => {
  let method = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": [
      url,
      {
        "encoding": "jsonParsed"
      }
    ]
  };
  // try {
  const res = await chainRequest(method);
  
  if (res.result.value) {
    programId.value = res.result.value.owner;
  }
}

onMounted(async () => {
  await loadTypeAddress();
  if (typeAddress.value == "address") {

  } else {
    await getInfo(url.value);
  }
  loading.value = true;
})
watch(
  () => route.path,
  (newPath, oldPath) => {
    // 在这里添加你需要执行的操作
    if (newPath != oldPath) {
      window.location.reload();
    }
  }
);

</script>
<template>
  <div style="width: 100%" v-if="loading">
    <accountView :url="url" v-if="typeAddress == 'address'"></accountView>
    <TokenView :url="url" v-if="typeAddress == 'mint'" :paramsId="programId" />
    <TokenAccountView :url="url" v-if="typeAddress == 'integration'" :owner="programId" />
  </div>
  <div v-else>
    <loading-vue />
  </div>
</template>

<style scoped>
table {
  width: 100%;
  height: auto;
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

:deep(.el-tabs__item) {
  color: #fff;
}

:deep(.is-active) {
  color: rgba(0, 255, 179, 1);
}

:deep(.el-tabs__active-bar) {
  background-color: rgba(0, 255, 179, 1);
}

:deep(.el-tabs__nav-wrap::after) {
  height: 0px !important;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

:deep(.el-dropdown-menu) {
  background-color: #2E3946 !important;
}

:deep(.el-dropdown-menu) {
  background-color: #2E3946 !important;
}

:deep(.el-tabs__content) {
  overflow: auto;
}

.align-center {
  display: flex;
  align-items: center;
}

.marginLeft10 {
  margin-left: 10px;
}
</style>