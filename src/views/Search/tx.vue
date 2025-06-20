<script setup>
import {
  getCurrentInstance,
  ref,
  watchEffect,
} from 'vue';

import i18n from '@/i18n';

import { solanapubbleys } from '../../components/method/solana';
import { titleUrl } from '../../components/method/title_url';
import { smartFormatNumber } from '../../components/number/smart.js';
import instructionView from '../../components/transaction/instruction.vue';
import { PROGRAM_INFO_BY_ID } from '../../program';
import { useAppStore } from '../../stores/index';
import logmessViem from '../transaction/methods/logmessage.vue';

const appStore = useAppStore();

const apps = getCurrentInstance()
const promaster = apps?.proxy?.$progream;
// 语言
function selectLanguage(indexValue) {
  i18n.global.locale = indexValue;
}

watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

</script>
<script>
import { useAppOptionStore } from "@/stores/app-option";
import { chainRequest } from "../../request/chain";
import moment from "moment";
import LoadingVue from "../../components/block/loading.vue"
import InfoTooltip from "../../components/infoTooltip.vue"

const appOption = useAppOptionStore();


export default {
  components: {
    LoadingVue,
    InfoTooltip
  },
  data() {
    return {
      url: null,
      card: null,
      historyData: null,
      type: null,
      preType: false,
      raw: true,
      laoding: false,
      instruction: null,
      initialize: null,
      unitLimit: null,
      innerInstructions: null,
    };
  },
  mounted() {
    appOption.appSidebarHide = true;
    appOption.appHeaderHide = true;
    appOption.appContentClass = "p-0";

  },
  beforeUnmount() {
    appOption.appSidebarHide = false;
    appOption.appHeaderHide = false;
    appOption.appContentClass = "";
  },
  methods: {
    submitForm: function () {
      //   this.$router.push("/");
    },
    async requestList(object) {
      try {
        const response = await chainRequest(object);
        // 解析和处理返回的数据
        return response.result; // 现在这个函数会返回解析后的数据
      } catch (error) {
        console.error("Error fetching epoch info:", error);
        return []; // 返回一个空数组或抛出错误取决于你的需求
      }
    },
    textValue(text) {
      return text.toUpperCase();
    },
    timeSome(time) {
      let nowInSeconds = Math.floor(moment().format("x") / 1000);
      let diffInSeconds = nowInSeconds - time;
      let duration = moment.duration(diffInSeconds, "seconds");
      if (duration.hours() > 0) {
        return (
          duration.hours() +
          "h " +
          duration.minutes() +
          "m " +
          duration.seconds() +
          "s"
        );
      } else if (duration.minutes() > 0) {
        return duration.minutes() + "m " + duration.seconds() + "s";
      } else {
        return duration.seconds() + "s";
      }
    },
    timeSome2(time) {
      return moment.unix(time).format("YYYY-MM-DD HH:mm:ss");
    },
    toFexedStake(num) {
      if (typeof num !== 'number') {
        throw new TypeError('The input must be a number.');
      }

      // 检查整数部分是否大于1
      if (Math.floor(Math.abs(num)) > 1) {
        return Number(num).toFixed(2);
      } else if (Math.abs(num) < 1 && num !== 0) {
        // 对于绝对值小于1且非零的数，保留5位小数
        return Number(num).toFixed(6);
      } else {
        // 如果是0或者整数部分等于1，则不做特殊处理，直接返回原值
        return num.toString();
      }
    },
    come(num) {
      if (num) {
        let reg =
          num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;


        return num.toString().replace(reg, "$1,");
      } else {
        return 0
      }

    },
    symbolNum(num) {
      let symbol = '';
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
      };
    },
    pubbleys(url) {
      this.$router.push({
        name: "address",
        params: {
          url: url,
        },
      })
    },
    dataDeal(item) {
      if (/^\d+$/.test(item.split(" ")[1])) {
        return {
          name: item.split(" ")[0],
          value: "System Program",
          type: item.split(" ")[2],
        };
      } else {
        return {
          name: item.split(" ")[0],
          value: item.split(" ")[1],
          type: item.split(" ")[2],
        };
      }
    },
    accountInput(str) {
      const firstFive = str.substr(0, 4);
      const rest = str.substr(4);
      if (/^[a-zA-Z]+$/.test(firstFive)) {
        if (/^\d+$/.test(rest)) {
          return `${firstFive} Program`;
        } else {
          return str;
        }
      } else {
        if (/^\d+$/.test(str)) {
          return "System Program";
        } else {
          return str;
        }
      }
    },
    styleSysmle(val) {
      if (val.value == 0) {
        return { color: '#698582', backgroundColor: '#2f3c3b' }
      } else if (val.type) {
        return { color: '#26e97e', backgroundColor: '#116939' }
      } else {
        return { color: '#fa62fc', backgroundColor: '#712c71' }
      }
    }

  },

  async created() {
    this.url = this.$route.params.item;
    this.type = this.$route.params.err;
    this.card = await this.requestList({
      jsonrpc: "2.0",
      id: "",
      method: "getSignatureStatuses",
      params: [
        [this.url],
        {
          searchTransactionHistory: true,
        },
      ],
    });

    this.historyData = await this.requestList({
      jsonrpc: "2.0",
      id: "",
      method: "getTransaction",
      params: [
        this.url,
        {
          commitment: "confirmed",
          encoding: "jsonParsed",
          maxSupportedTransactionVersion: 0,
        },
      ],
    });
    if (this.historyData) {
      this.instruction = this.historyData.transaction.message.instructions;
      this.innerInstructions = this.historyData.meta.innerInstructions;
      if (this.historyData.meta.logMessages[0].includes("Vote")) {
        this.preType = true;
      } else {
        this.preType = false;
      }
    }
    this.laoding = true


  },
  watch: {

    async $route(to, from) {
      console.log('变化');
      console.log(this.$route.params.item);

      this.laoding = false
      this.url = this.$route.params.item;
      this.type = this.$route.params.err;
      this.card = await this.requestList({
        jsonrpc: "2.0",
        id: "",
        method: "getSignatureStatuses",
        params: [
          [this.url],
          {
            searchTransactionHistory: true,
          },
        ],
      });
      this.historyData = await this.requestList({
        jsonrpc: "2.0",
        id: "",
        method: "getTransaction",
        params: [
          this.url,
          {
            commitment: "confirmed",
            encoding: "jsonParsed",
            maxSupportedTransactionVersion: 0,
          },
        ],
      });

      if (this.historyData) {
        if (this.historyData.meta.logMessages[0].includes("Vote")) {
          this.preType = true;
        } else {
          this.preType = false;
        }
      }

      this.laoding = true
    }
  }
};
</script>
<template>
  <div style="width: 100%;" v-if="laoding">
    <div v-if="url != null">
      <div>
        <h3>{{ $t("transaction.title") }}</h3>
        <!-- <table> -->
        <card class="md-3">
          <card-body class="card-bodys">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>{{ $t("transaction.overview") }}</td>
              <td class=" text-end"></td>
              </th>
              <tbody v-if="historyData">
                <tr>
                  <td>{{ $t("transactions.signature") }}</td>
                  <td class="text-end">{{ promaster[url] ? promaster[url].name : url }}</td>
                </tr>
                <tr>
                  <td>{{ $t("transaction.reault") }}</td>
                  <td class="text-end " :style="{ 'color': card.value[0].err == null ? '#26e97e' : 'red' }">
                    <span class="bagdge">
                      {{
                        card.value[0].err == null ? 'Success' : 'Failed' }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t("transaction.timestamp") }}</td>
                  <td class="text-end"> {{ timeSome2(historyData.blockTime) }} </td>
                </tr>
                <tr>
                  <td> {{ $t("transaction.confirmation_status") }} </td>
                  <td class="text-end"> {{ textValue(card.value[0].confirmationStatus) }} </td>
                </tr>
                <tr>
                  <td> {{ $t("transaction.confirmation") }} </td>
                  <td class="text-end"> {{ card.value[0].confirmations ? 'MIN' : 'MAX' }} </td>
                </tr>
                <tr v-if="card.value[0].slot">
                  <td>{{ $t("blocks.slot") }}</td>
                  <td class="text-end"> {{ come(card.value[0].slot) }} </td>
                </tr>
                <tr>
                  <td>
                    <InfoTooltip text="Timestamps are only available for confirmed blocks">
                      {{ $t("transaction.recent_blockhash") }}
                    </InfoTooltip>
                  </td>
                  <td class="text-end text-theme">
                    <text style="cursor: pointer"
                      @click="pubbleys(historyData.transaction.message.accountKeys[0].pubkey)">{{
                        promaster[historyData.transaction.message.accountKeys[0].pubkey] ?
                          promaster[historyData.transaction.message.accountKeys[0].pubkey].name
                          : historyData.transaction.message.accountKeys[0].pubkey
                      }}</text>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t("transaction.fee") }} (BTG)</td>
                  <td class="text-end"> {{ smartFormatNumber(historyData.meta.fee / 1000000000) }} </td>
                </tr>
                <tr>
                  <td>{{ $t("transaction.compute_units_consumed") }} </td>
                  <td class="text-end"> {{ historyData.meta.computeUnitsConsumed }} </td>
                </tr>
                <tr>
                  <td>{{ $t("transaction.transaction_version") }}</td>
                  <td class="text-end"> {{ textValue(historyData.version) }} </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td>{{ $t("transactions.signature") }}</td>
                  <td class="text-end">{{ url }}</td>
                </tr>
                <tr>
                  <td>{{ $t("transaction.result") }}</td>
                  <td class="text-end">
                    {{ $t("transaction.error") }}
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div style="margin-top:50px" v-if="historyData">
        <div v-if="historyData.transaction.message.accountKeys">
          <h4>{{ $t("transaction.account_input(s)") }} </h4>
          <card class="md-3">
            <card-body class="card-bodys">
              <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tbody>
                  <tr>
                    <th>
                      #
                    </th>
                    <th>
                      {{ $t("transaction.address") }}
                    </th>
                    <th>
                      {{ $t("transaction.guange") }}(BTG)
                    </th>
                    <th>
                      {{ $t("transaction.post_balance") }}(BTG)
                    </th>
                    <th>
                      {{ $t("transaction.detals") }}
                    </th>
                  </tr>
                  <tr v-for="item, index in historyData.transaction.message.accountKeys" :key="index">
                    <td>
                      {{ index + 1 }}
                    </td>
                    <td class="text-theme">
                      <text style="cursor: pointer" @click="pubbleys(item.pubkey)">{{ titleUrl(item.pubkey).url }}</text>
                      <img v-if="titleUrl(item.pubkey).type && !titleUrl(item.pubkey).assest"
                        v-for="(datas, indexs) in titleUrl(item.pubkey).certificates" :key="indexs" :src="datas.img"
                        height="24" class="marginRight8" alt="">
                      <text v-for="items, indexs in titleUrl(item.pubkey).certificates" :key="indexs"
                        :style="'background-color: ' + items.backColor"
                        style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                        {{ items.code }}
                      </text>
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
                        {{ $t("transaction.fee_payer") }}
                      </span>
                      <span v-if="item.signer" class="dage bg-info">{{ $t("transaction.signer") }}</span>
                      <span v-if="item.writable" class="dage bg-solt">{{ $t("transaction.writable") }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </card-body>
          </card>
        </div>
      </div>

      <div v-if="!preType && historyData">
        <h4 class="marginTOP-50">{{ $t("transaction.instruction") }}</h4>
        <instruction-view :data="instruction" :child="innerInstructions" />
      </div>

      <div style="margin-top:50px" v-if="preType">
        <h4>{{ $t("transaction.instruction") }}</h4>
        <card class="md-3 ">
          <card-body class="card-bodys">
            <table>
              <tbody v-if="historyData">
                <tr>
                  <td style="width:50%"> {{ $t("transaction.Instruction_Data") }} (JSON)</td>
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

<style scoped>
table {
  width: 100%;
}

.dage {
  display: inline-block;
  padding: 0.33em 0.5em;
  font-size: 80%;
  font-weight: 400;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: initial;
  border-radius: 0.375rem;
  margin: 0 5px;
}

.bg-info {
  background-color: #1e5159 !important;
  color: #43b5c5;
}

.bg-solt {
  color: #b45be1;
  background-color: #512965 !important;
}

pre {
  font-size: 80%;
}

.bagdge {
  padding: .33em .5em;
  font-size: 90%;
  background-color: #116939;
  font-weight: 400;
  border-radius: .375rem;
}

.symboldata {
  padding: .33em .5em;
  font-size: 90%;
  font-weight: 400;
  border-radius: .375rem;
}
</style>