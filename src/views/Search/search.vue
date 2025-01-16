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
import { titleUrl } from "../../components/method/title_url"
import { metaRequest } from "../../request/tokenMeta"
import TokensView from "../../components/address/tokens.vue"
import acquiesceIcon from "../../assets/icon-acquiesce.png"
import pledgeView from "../../components/address/pledge.vue"
import { solanagetAccount } from "../../request/solanaGetaccount";
import { PublicKey } from "@solana/web3.js";


const activeName = ref('first')
const router = useRouter();
const route = useRoute();

const url = ref(route.params.url);

const card_data = ref(null);
const token = ref(null);
const type = ref(false);
const loading = ref(false);
const endUrl = ref(route.params.url);
const token_name = ref(null);
const token_img = ref(null);
const token_symbol = ref(null);
const ownerType = ref(false);
const typeAddress = ref();
const loadTypeAddress = async () => {
  try {

    typeAddress.value = await solanapubbleys(route.params.url);

  } catch (error) {
    typeAddress.value = "address";
  }
};


const handleClick = (tab, event) => {
  // console.log(tab, event)
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
    return (num / 1000000000).toFixed(5);
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
  console.log(cardData);

  if (cardData) {
    if (cardData.value[0] != null) {
      card_data.value = cardData.value;
      type.value = true
    } else {
      type.value = false
    }
  } else {
    type.value = false
  }

  // token.value = await requestList({
  //   jsonrpc: "2.0",
  //   id: "",
  //   method: "getTokenAccountsByOwner",
  //   params: [
  //     url,
  //     {
  //       programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  //     },
  //     {
  //       commitment: "confirmed",
  //       encoding: "jsonParsed",
  //     },
  //   ],
  // });

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
    console.log(datas);


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
    router.push({
      name: "address",
      params: {
        url: url,
      },
    })
    await pubbleys(url);
  }
};

const tokenName = async (url, params) => {

  try {
    const res = await metaRequest(url, params);
    if (res) {
      token_name.value = res.name ? res.name : '';
      token_img.value = res.uri ? res.uri : "";
      token_symbol.value = res.symbol ? res.symbol : "";
    } else {

    }
    if (url == "B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz") {
      token_name.value = "Native";
      token_img.value = "https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png";
    }
  } catch (error) {

    token_name.value = '';
    console.error("Error fetching token info:", error);
  }
}

onMounted(async () => {
  await loadTypeAddress();

  await menufunction(url.value);
  await pubbleys(url.value);
  loading.value = true;
  console.log(typeAddress.value);
  if (typeAddress.value == 'mint') {
    await tokenName(url.value, card_data.value[0].owner)
  } else if (typeAddress.value == 'integration') {
    await tokenRwquest(url.value);
  }
})


const tokenRwquest = async (url) => {
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
  console.log(res);
  console.log('11111------1111');


  const res2 = await solanagetAccount(url, res.result.value.owner
  );
  console.log(res2);

  if (res2.mint) {
    let mint = BigInt(res2.mint._bn.toString());
    let getMint = new PublicKey(mint).toString();
    console.log(getMint);


    await mintReauest(getMint); // Ensure this is awaited
  }


  // } catch (err) {
  //     console.error(err); // Use console.error for errors
  // }
};

const mintReauest = async (url) => {
  console.log(url);

  await chainRequest(
    {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getAccountInfo",
      "params": [
        url,
        {
          "encoding": "jsonParsed"
        }
      ]
    }
  ).then(async resd => {
    try {
      await metaRequest(url, resd.result.value.owner).then(res => {
        token_name.value = res.name ? res.name : '';
        token_img.value = res.uri ? res.uri : "";
        token_symbol.value = res.symbol ? res.symbol : "";
      });
    } catch (err) {
      url == "B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz" ? token_name.value = "Native" : token_name.value = "";
      url == "B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz" ? token_img.value = "https://cdn.openverse.network/brands/bitgold/icon/bitgold_icon_128.png" : token_img.value = "";
    }
  });
};

watch(
  () => route.fullPath, // 监听整个路由的 fullPath 变化
  (toFullPath, fromFullPath) => {
    // 确保只有当 fullPath 发生变化时才刷新页面
    if (toFullPath !== fromFullPath) {
      console.log('路由发生变化:', toFullPath);
      window.location.reload();
    }
  },
  { deep: true } // 深度监听 fullPath 的变化
);

watch(route, (to, from) => {
  console.log(to, from);
  console.log(to.fullPath == from.fullPath);
})

</script>

<template>
  <div style="width: 100%" v-if="loading">
    <div>

      <h3 v-if="typeAddress == 'address' || !typeAddress"> {{ $t("account.title") }} </h3>
      <!-- 普通账户或非openverse账户 -->
      <h3 v-if="typeAddress == 'mint'" class="align-center">
        <!-- acquiesce -->
        <img :src="token_img ? token_img : ''"  alt="" class="marginRight10 imgWigth25" v-if="token_img">
        <text> {{ $t("account.token") }} : {{ token_name ? token_name : url }}
          <img v-if="url == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'" src="../../../src//assets//renzheng.png"
            width="20" alt="">
        </text>
      </h3>
      <!-- 通政 -->
      <h3 v-if="typeAddress == 'integration'" class="align-center">
        <img :src="token_img ? token_img : ''"  alt="" class="marginRight10 imgWigth25" v-if="token_img">
        <text> {{ token_name ? token_name : '' }} {{ $t("account.tokenAccount") }}
          <text v-if="url == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'">(WBTG)</text> &nbsp;
          <text v-if="token_symbol">({{ token_symbol }})</text> &nbsp;
          <img v-if="url == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz'" src="../../../src//assets//renzheng.png"
            width="20" alt="">
        </text>
      </h3>
      <!-- 通证账户 -->
      <div v-if="type">
        <card class="md-3 " v-if="typeAddress == 'address'">
          <card-body class="card-bodys">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
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
                    {{ titleUrl(item.owner).url }} 
                    <!-- <img v-if="titleUrl(item.owner).type"
                      src="../../../src//assets//renzheng.png" width="16" alt=""> -->
                      <img v-if="titleUrl(item.owner).type" v-for="(datas,indexs) in titleUrl(item.owner).certificates" :key="indexs" :src="datas.img" width="16" class="marginRight8" alt="">

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
        <token-view v-if="typeAddress == 'mint'" :url="url"></token-view>
        <!-- <token-view /> -->
        <token-account-view v-if="typeAddress == 'integration'" :url="url"
          :paramsId="card_data[0].owner"></token-account-view>
        <!-- <token-account-view/> -->
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
      <div class="tab-content marginTOP-50" v-if="menu.length != 0">
        <Tokens-View :tokens="menu" />
      </div>
      <div class="tab-content marginTOP-50">
        <card class="md-3">
          <card-body class="card-bodys">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane :label="$t('navigation.transactions')" name="first">
                <history-view :url="url"></history-view>
              </el-tab-pane>
              <template>
                <el-tab-pane :label="$t('transfer')" name="second">
                  <transfer-view :url="url"></transfer-view>
                </el-tab-pane>
              </template>
              <template v-if="card_data">
                <el-tab-pane v-if="typeAddress == 'mint'" :label="$t('account.holder')" name="third">
                  <holder-view :url="url" :paramsId="card_data[0].owner"></holder-view>
                </el-tab-pane>
              </template>
              <template v-if="card_data">
                <el-tab-pane v-if="typeAddress == 'address'" :label="$t('pledge')" name="fourth">
                  <pledgeView :url="url" :owner="card_data[0].owner" />
                </el-tab-pane>
              </template>

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