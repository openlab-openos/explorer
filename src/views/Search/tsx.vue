<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import {
  useRoute,
  useRouter,
} from 'vue-router';

import { useAppOptionStore } from '@/stores/app-option';

import LoadingVue from '../../components/block/loading.vue';
import InfoTooltip from '../../components/infoTooltip.vue';
import { solanapubbleys } from '../../components/method/solana';
import { titleUrl } from '../../components/method/title_url';
import { smartFormatNumber } from '../../components/number/smart.js';
import RenderText from '../../components/Render/text.vue';
import instructionView from '../../components/transaction/instruction.vue';
import { PROGRAM_INFO_BY_ID } from '../../program';
import { chainRequest } from '../../request/chain';
import { useAppStore } from '../../stores/index';
import logmessViem from '../transaction/methods/logmessage.vue';

// 存储
const appStore = useAppStore()
const appOption = useAppOptionStore()
const { language } = storeToRefs(appStore)

// 路由
const router = useRouter()
const route = useRoute()

// 国际化
const { t, locale } = useI18n()

// 响应式数据
const url = ref(null)
const card = ref(null)
const historyData = ref(null)
const type = ref(null)
const preType = ref(false)
const raw = ref(true)
const laoding = ref(false)
const instruction = ref(null)
const initialize = ref(null)
const unitLimit = ref(null)
const innerInstructions = ref(null)
const voteData = ref(null)

// 计算属性
const promaster = computed(() => {
  return appStore.$progream || {}
})

// 方法
const blockSkip = (num) => {
  router.push({ name: "block", params: { url: num } })
}

const requestList = async (object) => {
  try {
    const response = await chainRequest(object)
    return response.result
  } catch (error) {
    console.error("Error fetching epoch info:", error)
    return []
  }
}

const textValue = (text) => {
  if (typeof text == 'string') {
    return text.toUpperCase()
  } else {
    return text
  }
}

const timeSome = (time) => {
  let nowInSeconds = Math.floor(moment().format("x") / 1000)
  let diffInSeconds = nowInSeconds - time
  let duration = moment.duration(diffInSeconds, "seconds")
  if (duration.hours() > 0) {
    return (
      duration.hours() +
      "h " +
      duration.minutes() +
      "m " +
      duration.seconds() +
      "s"
    )
  } else if (duration.minutes() > 0) {
    return duration.minutes() + "m " + duration.seconds() + "s"
  } else {
    return duration.seconds() + "s"
  }
}

const timeSome2 = (time) => {
  return moment.unix(time).format("YYYY-MM-DD HH:mm:ss")
}

const toFexedStake = (num) => {
  if (typeof num !== 'number') {
    throw new TypeError('The input must be a number.')
  }

  // 检查整数部分是否大于1
  if (Math.floor(Math.abs(num)) > 1) {
    return Number(num).toFixed(2)
  } else if (Math.abs(num) < 1 && num !== 0) {
    // 对于绝对值小于1且非零的数，保留5位小数
    return Number(num).toFixed(6)
  } else {
    // 如果是0或者整数部分等于1，则不做特殊处理，直接返回原值
    return num.toString()
  }
}

const come = (num) => {
  if (num) {
    let reg =
      num.toString().indexOf(".") > -1
        ? /(\d)(?=(\d{3})+\.)/g
        : /(\d)(?=(\d{3})+$)/g

    return num.toString().replace(reg, "$1,")
  } else {
    return 0
  }
}

const symbolNum = (num) => {
  let symbol = ''
  if (num < 0) {
    symbol = ''
  } else if (num > 0) {
    symbol = '+'
  } else {
    symbol = ''
  }

  return {
    type: symbol == '' ? false : true,
    value: symbol + num,
  }
}

const pubbleys = (url) => {
  router.push({
    name: "address",
    params: {
      url: url,
    },
  })
}

const dataDeal = (item) => {
  if (/^\d+$/.test(item.split(" ")[1])) {
    return {
      name: item.split(" ")[0],
      value: "System Program",
      type: item.split(" ")[2],
    }
  } else {
    return {
      name: item.split(" ")[0],
      value: item.split(" ")[1],
      type: item.split(" ")[2],
    }
  }
}

const accountInput = (str) => {
  const firstFive = str.substr(0, 4)
  const rest = str.substr(4)
  if (/^[a-zA-Z]+$/.test(firstFive)) {
    if (/^\d+$/.test(rest)) {
      return `${firstFive} Program`
    } else {
      return str
    }
  } else {
    if (/^\d+$/.test(str)) {
      return "System Program"
    } else {
      return str
    }
  }
}

const styleSysmle = (val) => {
  if (val.value == 0) {
    return { color: '#698582', backgroundColor: '#2f3c3b' }
  } else if (val.type) {
    return { color: '#26e97e', backgroundColor: '#116939' }
  } else {
    return { color: '#fa62fc', backgroundColor: '#712c71' }
  }
}

const voteFunction = async (data) => {
  let method = {
    jsonrpc: "2.0",
    id: 1,
    method: "getMultipleAccounts",
    params: [
      data,
      {
        commitment: "confirmed",
        encoding: "jsonParsed",
      },
    ],
  }
  let datas = await requestList(method)
  voteData.value = datas.value
  console.log(voteData.value)
}

// 初始化数据
const fetchData = async () => {
  laoding.value = false
  url.value = route.params.item
  type.value = route.params.err
  
  card.value = await requestList({
    jsonrpc: "2.0",
    id: "",
    method: "getSignatureStatuses",
    params: [
      [url.value],
      {
        searchTransactionHistory: true,
      },
    ],
  })

  historyData.value = await requestList({
    jsonrpc: "2.0",
    id: "",
    method: "getTransaction",
    params: [
      url.value,
      {
        commitment: "confirmed",
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
      },
    ],
  })

  console.log(historyData.value)

  if (historyData.value) {
    console.log(1111)
    
    instruction.value = historyData.value.transaction.message.instructions
    innerInstructions.value = historyData.value.meta.innerInstructions
    if (historyData.value.meta.logMessages[0].includes("Vote")) {      
      preType.value = true    
    } else {
      preType.value = false
      let voteArray = []
      for(let i in historyData.value.transaction.message.accountKeys){
        voteArray.push(historyData.value.transaction.message.accountKeys[i].pubkey)
      }
      if(voteArray.length !=0){
        voteFunction(voteArray)
      }
      console.log(voteArray)
    }
  }
  laoding.value = true
}

// 生命周期
onMounted(() => {
  appOption.appSidebarHide = true
  appOption.appHeaderHide = true
  appOption.appContentClass = "p-0"
  
  // 设置语言
  locale.value = language.value
  
  // 初始化数据
  fetchData()
})

onUnmounted(() => {
  appOption.appSidebarHide = false
  appOption.appHeaderHide = false
  appOption.appContentClass = ""
})

// 监听路由变化
watch(() => route.params, (newParams, oldParams) => {
  if (newParams.item !== oldParams.item) {
    fetchData()
  }
})

// 监听语言变化
watch(language, (newLang) => {
  locale.value = newLang
})
</script>

<template>
  <div style="width: 100%;" v-if="laoding">
    <div v-if="url != null">
      <div>
        <h3>{{ t("transaction.title") }}</h3>
        <!-- <table> -->
        <card class="md-3">
          <card-body class="card-bodys">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>{{ t("transaction.overview") }}</td>
              <td class=" text-end"></td>
              </th>
              <tbody v-if="historyData">
                <tr>
                  <td>{{ t("transactions.signature") }}</td>
                  <td class="text-end">{{ promaster[url] ? promaster[url].name : url }}</td>
                </tr>
                <tr>
                  <td>{{ t("transaction.reault") }}</td>
                  <td class="text-end " :style="{ 'color': card.value[0].err == null ? '#26e97e' : 'red' }">
                    <span class="bagdge">
                      {{
                        card.value[0].err == null ? t('success') : t('failed') }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{{ t("transaction.timestamp") }}</td>
                  <td class="text-end"> {{ timeSome2(historyData.blockTime) }} </td>
                </tr>
                <tr>
                  <td> {{ t("transaction.confirmation_status") }} </td>
                  <td class="text-end"> {{ textValue(card.value[0].confirmationStatus) }} </td>
                </tr>
                <tr>
                  <td> {{ t("transaction.confirmation") }} </td>
                  <td class="text-end"> {{ card.value[0].confirmations ? 'MIN' : 'MAX' }} </td>
                </tr>
                <tr v-if="card.value[0].slot">
                  <td>{{ t("blocks.slot") }}</td>
                  <td class="text-end"> {{ come(card.value[0].slot) }} </td>
                </tr>
                <tr>
                  <td>
                    <InfoTooltip :text="t('transaction.timestamp_tooltip')">
                      {{ t("transaction.recent_blockhash") }}
                    </InfoTooltip>
                  </td>
                  <td class="text-end text-theme">
                    <text style="cursor: pointer" @click="blockSkip(historyData.slot)">
                      {{ historyData.transaction.message.recentBlockhash }}
                    </text>
                  </td>
                </tr>
                <tr>
                  <td>{{ t("transaction.fee") }} (BTG)</td>
                  <td class="text-end"> {{ (historyData.meta.fee / 1000000000) }} </td>
                  <!-- <td class="text-end"> {{ smartFormatNumber(historyData.meta.fee / 1000000000) }} </td> -->
                </tr>
                <tr>
                  <td>{{ t("transaction.compute_units_consumed") }} </td>
                  <td class="text-end"> {{ historyData.meta.computeUnitsConsumed }} </td>
                </tr>
                <tr>
                  <td>{{ t("transaction.transaction_version") }}</td>
                  <td class="text-end"> {{ textValue(historyData.version) }} </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td>{{ t("transactions.signature") }}</td>
                  <td class="text-end">{{ url }}</td>
                </tr>
                <tr>
                  <td>{{ t("transaction.result") }}</td>
                  <td class="text-end">
                    {{ t("transaction.error") }}
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div style="margin-top:50px" v-if="historyData">
        <div v-if="historyData.transaction.message.accountKeys">
          <h4>{{ t("transaction.account_input(s)") }} </h4>
          <card class="md-3">
            <card-body class="card-bodys">
              <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tbody>
                  <tr>
                    <th>
                      #
                    </th>
                    <th>
                      {{ t("transaction.address") }}
                    </th>
                    <th>
                      {{ t("transaction.guange") }}(BTG)
                    </th>
                    <th>
                      {{ t("transaction.post_balance") }}(BTG)
                    </th>
                    <th>
                      {{ t("transaction.detals") }}
                    </th>
                  </tr>
                  <tr v-for="item, index in historyData.transaction.message.accountKeys" :key="index">
                    <td>
                      {{ index + 1 }}
                    </td>
                    <td class="text-theme">
                      <template v-if="voteData">
                        <template v-if="voteData[index]?.data?.parsed?.info?.extensions" >
                          <div v-if="voteData[index]?.data?.parsed?.info?.extensions[voteData[index]?.data?.parsed?.info?.extensions.length-1].extension == 'tokenMetadata' ">
                            <img :src="voteData[index]?.data?.parsed?.info?.extensions[voteData[index]?.data?.parsed?.info?.extensions.length-1].state.uri" width="24" alt=""> {{ voteData[index]?.data?.parsed?.info?.extensions[voteData[index]?.data?.parsed?.info?.extensions.length-1].state.name }} ( {{ voteData[index]?.data?.parsed?.info?.extensions[voteData[index]?.data?.parsed?.info?.extensions.length-1].state.symbol }} )
                          </div>
                          <div v-else>
                            <RenderText v-if="item.pubkey" :address="item.pubkey" />
                          </div>
                        </template>
                        <template v-else>
                          <RenderText v-if="item.pubkey" :address="item.pubkey" />
                        </template>
                      </template>
                      <template v-else>
                          <RenderText v-if="item.pubkey" :address="item.pubkey" />
                      </template>
                    </td>
                    <td v-if="historyData.meta.postBalances">
                      <span class="symboldata" :style="styleSysmle(
                        symbolNum(come(smartFormatNumber((historyData.meta.postBalances[index] -
                          historyData.meta.preBalances[index]) / 1000000000)))
                      )
                        ">
                        {{ symbolNum(come(smartFormatNumber((historyData.meta.postBalances[index] -
                          historyData.meta.preBalances[index]) / 1000000000))).value
                        }}
                      </span>
                    </td>
                    <td v-else></td>
                    <td v-if="historyData.meta.postBalances">
                      {{ come(smartFormatNumber(historyData.meta.postBalances[index] / 1000000000)) }}
                    </td>
                    <td v-else></td>
                    <td style="text-align: left;font-size: 12px;">
                      <span v-if="item.signer ? (item.writable ? (index == 0 ? true : false) : false) : false"
                        class="dage bg-info">
                        {{ t("transaction.fee_payer") }}
                      </span>
                      <span v-if="item.signer" class="dage bg-info">{{ t("transaction.signer") }}</span>
                      <span v-if="item.writable" class="dage bg-solt">{{ t("transaction.writable") }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </card-body>
        </card>
        </div>
      </div>

      <div v-if="!preType && historyData">
        <h4 class="marginTOP-50">{{ t("transaction.instruction") }}</h4>
        <instruction-view :data="instruction" :child="innerInstructions" />
      </div>

      <div style="margin-top:50px" v-if="preType">
        <h4>{{ t("transaction.instruction") }}</h4>
        <card class="md-3 ">
          <card-body class="card-bodys">
            <table>
              <tbody v-if="historyData">
                <tr>
                  <td style="width:50%"> {{ t("transaction.Instruction_Data") }} (JSON)</td>
                  <td style="width:50%">
                    <pre style="background-color: #18202C;border:none;color:#fff;line-height:15px">
                {{ historyData.transaction.message.instructions[0].parsed }}
              </pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div style="margin-top:50px" v-if="historyData">
        <logmess-viem :data="historyData"></logmess-viem>
      </div>
    </div>
  </div>
  <div v-else>
    <LoadingVue />
  </div>
</template>

<!-- <style scoped>
table {
  width: 100%;
}

.dage {
  display: inline-block;
  padding: 0.33em 0.5em;
  font-size: 80%;
  font-weight: 400;
  line-height: 1; -->