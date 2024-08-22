<script setup>
import { getCurrentInstance, ref } from "vue";
const apps = getCurrentInstance()
const promaster = apps?.proxy?.$progream;
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
      if (num) {
        return JSON.stringify(num / 1000000000);
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
      });
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
      if (this.historyData.meta.logMessages[0].includes("Vote")) {
        this.preType = true;
      }
    }

    this.laoding = true

  },
};
</script>
<template>
  <div style="width: 100%;" v-if="laoding">
    <div v-if="url != null">
      <div>
        <h3>Transaction</h3>
        <!-- <table> -->
        <card class="md-3">
          <card-body class="card-bodys">
            <table v-if="card != null"
              class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>Overview</td>
              <td class=" text-end"></td>
              </th>
              <tbody v-if="historyData">
                <tr>
                  <td>Signature</td>
                  <td class="text-end">{{ promaster[this.url] ? promaster[this.url].name : this.url }}</td>
                </tr>
                <tr>
                  <td>Result</td>
                  <td class="text-end " :style="{ 'color': card.value[0].err == null ? '#26e97e' : 'red' }">

                    <span class="bagdge">
                      {{
                        card.value[0].err == null ? 'Success' : 'Failed' }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Timestamp</td>
                  <td class="text-end"> {{ timeSome2(historyData.blockTime) }} </td>
                </tr>
                <tr>
                  <td> Confirmation Status </td>
                  <td class="text-end"> {{ textValue(card.value[0].confirmationStatus) }} </td>
                </tr>
                <tr>
                  <td> Confirmation </td>
                  <td class="text-end"> {{ card.value[0].confirmations ? 'MIN' : 'MAX' }} </td>
                </tr>
                <tr v-if="card.value[0].slot">
                  <td>Slot</td>
                  <td class="text-end"> {{ come(card.value[0].slot) }} </td>
                </tr>
                <tr>
                  <td>
                    <InfoTooltip text="Timestamps are only available for confirmed blocks">
                      Recent Blockhash
                    </InfoTooltip>
                  </td>
                  <td class="text-end text-theme" style="cursor: pointer"
                    @click="pubbleys(historyData.transaction.message.accountKeys[0].pubkey)"> {{
                      promaster[historyData.transaction.message.accountKeys[0].pubkey] ?
                        promaster[historyData.transaction.message.accountKeys[0].pubkey].name
                        : historyData.transaction.message.accountKeys[0].pubkey
                    }} </td>
                </tr>
                <tr>
                  <td>Fee (BTG)</td>
                  <td class="text-end"> {{ toFexedStake(historyData.meta.fee) }} </td>
                </tr>
                <tr>
                  <td>Compute units consumed</td>
                  <td class="text-end"> {{ historyData.meta.computeUnitsConsumed }} </td>
                </tr>
                <tr>
                  <td>Transaction Version</td>
                  <td class="text-end"> {{ textValue(historyData.version) }} </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td>Signature</td>
                  <td class="text-end">{{ url }}</td>
                </tr>
                <tr>
                  <td>Result</td>
                  <td class="text-end">
                    Transaction is invaild
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>

        </card>
      </div>
      <div style="margin-top:50px" v-if="historyData">
        <h4>Instruction</h4>
        <card class="md-3">
          <card-body class="card-bodys" v-if="historyData.transaction.message.instructions">
            <table class=" w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <tr>
                <th>
                  <span class="text-theme">
                    #
                  </span> System Program: Transfer
                </th>
                <th>

                </th>
                <th>
                </th>
              </tr>
              <tbody v-for="item, index in historyData.transaction.message.instructions" :key="index">
                <tr>
                  <td>
                    Program
                  </td>
                  <td class="text-theme" style="cursor: pointer" @click="pubbleys(item.programId)">
                    {{
                      promaster[item.programId] ? promaster[item.programId].name : item.programId
                    }}
                  </td>
                  <td></td>
                </tr>
                <tr v-if="item.parsed.info.destination">
                  <td>
                    From Address
                  </td>
                  <td class="text-theme" style="cursor: pointer" @click="pubbleys(item.parsed.info.destination)">
                    {{
                      promaster[item.parsed.info.destination] ? promaster[item.parsed.info.destination].name :
                        item.parsed.info.destination }}
                  </td>
                  <td></td>
                </tr>
                <tr v-if="item.parsed.info.source">
                  <td>
                    To Address
                  </td>
                  <td class="text-theme" style="cursor: pointer" @click="pubbleys(item.parsed.info.source)">

                    {{
                      promaster[item.parsed.info.source] ? promaster[item.parsed.info.source].name :
                        item.parsed.info.source }}
                  </td>
                  <td></td>
                </tr>
                <tr v-if="item.parsed.info.lamports">
                  <td>
                    Transfer Amount (BTG)
                  </td>
                  <td class="text-theme">
                    {{ toFexedStake(item.parsed.info.lamports) }}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div style="margin-top:50px" v-if="historyData">
        <div v-if="historyData.transaction.message.accountKeys">
          <h4>Account Input(s)</h4>
          <card class="md-3">
            <card-body class="card-bodys">
              <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tbody>
                  <tr>
                    <th>
                      #
                    </th>
                    <th>
                      ADDRESS
                    </th>
                    <th>
                      GHANGE(BTG)
                    </th>
                    <th>
                      POST BALANCE(BTG)
                    </th>
                    <th>
                      DETAILS
                    </th>
                  </tr>
                  <tr v-for="item, index in historyData.transaction.message.accountKeys" :key="index">
                    <td>
                      {{ index + 1 }}
                    </td>
                    <td class="text-theme" style="cursor: pointer" @click="pubbleys(item.pubkey)">
                      <!-- {{ item.pubkey }} -->
                      {{
                        promaster[item.pubkey] ? promaster[item.pubkey].name : item.pubkey
                      }}
                    </td>
                    <td v-if="historyData.meta.postBalances[index]">
                      <span class="symboldata" :style="styleSysmle(
                        symbolNum(come(toFexedStake(historyData.meta.postBalances[index] -
                          historyData.meta.preBalances[index])))
                      )
                        ">
                        {{ symbolNum(come(toFexedStake(historyData.meta.postBalances[index] -
                          historyData.meta.preBalances[index]))).value
                        }}
                      </span>
                    </td>
                    <td v-if="historyData.meta.postBalances[index]">
                      {{ come(toFexedStake(historyData.meta.postBalances[index])) }}
                    </td>
                    <td style="text-align: left;font-size: 12px;">
                      <span v-if="item.signer ? (item.writable ? true : false) : false" class="dage bg-info">Fee
                        Payer</span>
                      <span v-if="item.signer" class="dage bg-info">Signer</span>
                      <span v-if="item.writable" class="dage bg-solt">Writable</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </card-body>
          </card>
        </div>
      </div>
      <div style="margin-top:50px" v-if="preType">
        <h4>Instruction</h4>
        <card class="md-3 ">
          <card-body class="card-bodys">
            <table>
              <tbody v-if="historyData">
                <tr>
                  <td style="width:50%">Instruction Data (JSON)</td>
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
      <div style="margin-top:50px">
        <card class="md-3 " v-if="historyData">
          <card-body class="card-bodys">
            <div>
              <div style="width:100%;display:flex;justify-content: space-between;">
                <h4>LogMessages</h4>
                <div>
                  <span style="cursor: pointer" @click="raw = !raw">Raw</span>
                </div>
              </div>
              <div v-if="raw">
                <div v-for="(item, index) in historyData.transaction.message.instructions" :key="index">
                  <div style="display:flex;">
                    <span style="color:#26E97E;background-color:#116939;" class="dage"># {{ index + 1 }}</span>
                    <h6 style="margin:0;">{{ textValue(item.parsed.type) }}</h6>
                  </div>
                  <div>
                    <ul>
                      <li v-for="(items, indexs) in historyData.meta.logMessages" :key="indexs" :class="dataDeal(items, item.programId).type == 'success' ? 'text-theme' : ''
                        ">
                        {{ dataDeal(items, item.programId).name }}
                        &nbsp;{{ dataDeal(items, item.programId).value }}
                        &nbsp;{{ dataDeal(items, item.programId).type
                        }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div v-if="!raw">
                <pre style="background-color: #18202C;border:none;color:#fff;line-height:15px">
                            {{
                              historyData.meta.logMessages
                            }}
                        </pre>
              </div>
            </div>
          </card-body>
        </card>
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