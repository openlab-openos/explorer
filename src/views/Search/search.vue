<script setup>
import { getCurrentInstance, ref, watchEffect, onMounted, watch } from "vue";
import i18n from "@/i18n"
import { useAppStore } from "../../stores/index";
import historyView from "../../components/address/history_list.vue"
import { useRouter, useRoute } from "vue-router";
import { chainRequest } from "../../request/chain";
import LoadingVue from "../../components/block/loading.vue"
import { solanapubbleys } from "../../components/method/solana"
import transferView from "../../components/address/transfer_list.vue";
import holderView from "../../components/address/holder_list.vue";
import tokenView from "../../components/address/token.vue";
import tokenAccountView from "../../components/address/token_account.vue";

const activeName = ref('first')
const router = useRouter();
const route = useRoute();

const url = ref(route.params.url);
const card_data = ref(null);
const token = ref(null);
const type = ref(false);
const loading = ref(false);
const endUrl = ref(route.params.url);

const typeAddress = ref(route.params.type)
const handleClick = (tab, event) => {
  console.log(tab, event)
}

const appStore = useAppStore();
const accountType = ref(false);
const apps = getCurrentInstance()
const promaster = apps?.proxy?.$progream;
const menu = ref([]);
const paramsId = ref([
  "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
]);
// 语言
function selectLanguage(indexValue) {
  i18n.global.locale = indexValue;
}

function isValidResponse(response) {
  const allNumbers = /^[0-9]+$/;
  const contains11111 = /1{5,}/.test(response);

  if (allNumbers.test(response) || contains11111) {
    accountType.value = false
    return false;
  }
  accountType.value = true
  return true;
}

watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

const toFexedStake = (num) => {
  if (num) {
    return num / 1000000000;
  }
}

const come = (num) => {
  let reg =
    num.toString().indexOf(".") > -1
      ? /(\d)(?=(\d{3})+\.)/g
      : /(\d)(?=(\d{3})+$)/g;

  return num.toString().replace(reg, "$1,");
}

const requestList = async (object) => {
  try {
    const response = await chainRequest(object);
    // 解析和处理返回的数据
    return response.result; // 现在这个函数会返回解析后的数据
  } catch (error) {
    return []; // 返回一个空数组或抛出错误取决于你的需求
  }
}

const pubbleys = async (url) => {
  // this.url = url;
  let cardData = await requestList({
    jsonrpc: "2.0",
    id: 1,
    method: "getMultipleAccounts",
    params: [
      [url],
      {
        commitment: "confirmed",
        encoding: "jsonParsed",
      },
    ],
  });

  if (cardData) {
    card_data.value = cardData.value;
    type.value = true
  } else {
    type.value = false
  }

  token.value = await requestList({
    jsonrpc: "2.0",
    id: "",
    method: "getTokenAccountsByOwner",
    params: [
      url,
      {
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
      {
        commitment: "confirmed",
        encoding: "jsonParsed",
      },
    ],
  });

};

const menufunction = async (url) => {
  for (let i in paramsId.value) {
    let methods =
    {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getTokenAccountsByOwner",
      "params": [
        url,
        {
          "programId": paramsId.value[i]
        },
        {
          "encoding": "jsonParsed"
        }
      ]
    }
    let datas = await requestList(methods);
    if (datas) {
      for (let i in datas.value) {
        menu.value.push(datas.value[i])
      }
    }
  }
}


const exexutable = async (url) => {
  if (url == null) {
    router.go(-1);
    await pubbleys(endUrl);
  } else {
    solanapubbleys(url, router);
    await pubbleys(url);
  }
};


onMounted(async () => {
  await menufunction(url.value);
  await pubbleys(url.value);
  if (menu.value.length == 0) {
    accountType.value = false
  } else {
    accountType.value = true
  }
  loading.value = true;
})


watch((to, from) => {
  endUrl.value = route.params.url;
  url.value = route.params.url;
})

</script>

<template>
  <div style="width: 100%" v-if="loading">
    <div>
      <h3 v-if="typeAddress == 'address'"> {{ $t("account.title") }} </h3>
      <!-- 普通账户或非openverse账户 -->
      <h3 v-if="typeAddress == 'health'"> {{ $t("account.token") }} </h3>
      <!-- 通政 -->
      <h3 v-if="typeAddress == 'integration'"> {{ $t("account.token_account") }} </h3>
      <!-- 通证账户 -->
      <div v-if="type">
        <card class="md-3 ">
          <card-body class="card-bodys">
            <table v-if="typeAddress == 'address'"
              class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>{{ $t("account.overview") }} </td>
              <td class=" text-end"></td>
              </th>
              <tbody v-for="(item, index) in card_data" :key="index">
                <tr>
                  <td>{{ $t("account.address") }} </td>
                  <td class="text-end">{{ url }}</td>
                </tr>
                <tr v-if="promaster[url]">
                  <td>{{ $t("account.address_label") }} </td>
                  <td class="text-end">{{ promaster[url].name }}</td>
                </tr>
                <tr>
                  <td>{{ $t("account.balance") }} (BTG)</td>
                  <td class="text-end"> {{ card_data[index] == null ? 'Account does not exist' :
                    come(toFexedStake(item.lamports)) }} </td>
                </tr>
                <tr>
                  <td>{{ $t("account.allocated_data_size") }} </td>
                  <td class="text-end"> {{ card_data[index] == null ? '0' : item.space }} byte(s)</td>
                </tr>
                <tr>
                  <td>{{ $t("account.assigned_program_id") }} </td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="exexutable(item.owner)">
                    {{ isValidResponse(item.owner) ? 'Native Loader' : ' System Program' }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $t("account.executable") }} </td>
                  <td class="text-end"> {{ card_data[index] == null ? 'NO' : (item.executable ? 'YES' : 'NO') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
        <!-- <token-view v-if="typeAddress == 'health'" :url="url"></token-view> -->
        <token-view />
        <token-account-view v-if="typeAddress == 'integration'" :url="url"></token-account-view>
      </div>
      <div v-else>
        <card class="md-3">
          <card-body class="card-bodys">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>{{ $t("account.overview") }} </td>
              <td class=" text-end"></td>
              </th>
              <tbody>
                <tr>
                  <td>{{ $t("account.address") }} </td>
                  <td class="text-end">{{ url }}</td>
                </tr>
                <tr>
                  <td>{{ $t("account.blance") }} (BTG)</td>
                  <td class="text-end" style="color: red;"> {{ $t("account.error") }}</td>
                </tr>
                <tr>
                  <td>{{ $t("account.allocated_data_size") }}</td>
                  <td class="text-end"> 0 byte(s)</td>
                </tr>
                <tr>
                  <td>{{ $t("account.assigned_program_id") }}</td>
                  <td class="text-end text-theme" style="cursor: pointer">
                    {{ $t("account.native_label") }}</td>
                </tr>
                <tr>
                  <td>{{ $t("account.executable") }}</td>
                  <td class="text-end"> NO
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div
        v-if="!accountType && !isValidResponse(card_data[0].owner) && card_data[0] != null && typeAddress == 'address'"
        class="marginTOP-50">
        <card class="md-3" v-if="menu">
          <card-body>
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>{{ $t("account.Political_integration") }} </td>
              <td class=" text-end"></td>
              </th>
              <tbody>
                <tr>
                  <td>{{ $t("account.type_administration") }} </td>
                  <td class="text-end"> {{ menu.length }} {{ $t("account.Political_integration") }} </td>
                </tr>
                <tr v-if="menu.length != 0">
                  <td>{{ $t("account.list_communication") }}</td>
                  <td class="text-end" style="color: red;">
                    <button class="btn btn-outline-default dropdown-toggle" type="button" data-bs-toggle="dropdown"
                      aria-haspopup="true" aria-expanded="false">Filter products &nbsp;</button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div class="tab-content marginTOP-50">
        <card class="md-3">
          <card-body class="card-bodys">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane v-if="false" :label="$t('transfer')" name="first">
                <transfer-view :url="url"></transfer-view>
              </el-tab-pane>
              <el-tab-pane :label="$t('dashboard.history')" name="second">
                <history-view :url="url"></history-view>
              </el-tab-pane>
              <el-tab-pane v-if="typeAddress == 'health'" :label="$t('account.holder')" name="third">
                <holder-view :url="url" :paramsId="card_data[0].owner"></holder-view>
              </el-tab-pane>
            </el-tabs>
          </card-body>
        </card>
      </div>
    </div>
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
</style>