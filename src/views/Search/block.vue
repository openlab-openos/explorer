<script>
import { useAppOptionStore } from "@/stores/app-option";
import { chainRequest } from "../../request/chain";
import moment from "moment";
import router from "../../router";
import { getCurrentInstance, ref } from "vue";
import LoadingVue from "../../components/block/loading.vue"
import { solanapubbleys } from "../../components/method/solana"

const apps = getCurrentInstance()

const promaster = ref(apps?.proxy?.$progream);

const appOption = useAppOptionStore();

export default {
  components: {
    LoadingVue
  },
  data() {
    return {
      url: null,
      card: null,
      historyData: null,
      type: null,
      transaction: null,
      transactionArray: null,
      success: null,
      loading: false
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
        return num / 1000000000;
      }
    },
    Successful(item) {
      let itemArray = [];
      for (let i in item) {
        if (item.err == null) {
          itemArray.push(item[i]);
        }
      }
      return itemArray.length;
    },
    sliceSignature(item) {
      // return item.slice(0, 50) + "...";
      return item
    },
    programs(item) {
      let arr = [];

      for (let i in item) {
        let parts = item[i].split(" ");
        if (parts[2] == "success") {
          arr.push(parts[1]);
        }
      }
      const counts = arr.reduce((acc, cur) => {
        if (acc[cur]) {
          acc[cur]++; // 如果元素已存在，则增加其计数
        } else {
          acc[cur] = 1; // 否则，初始化计数为1
        }
        return acc;
      }, {});
      const result = Object.keys(counts).map((key) => ({
        prc: key,
        num: counts[key],
      }));

      return result;
    },
    prchandle(str) {
      if (str.length < 5) {
        return str;
      }

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
    pubbleys(url) {
      this.$router.push({
        name: "address",
        params: {
          url: url,
        },
      })
    },
    soltResult(url) {
      this.$router
        .push({
          name: "block",
          params: {
            url: url,
          },
        })
        .then((res) => {
          // location.reload();
        });
    },
    transtion(item) {
      this.$router.push({
        name: "tx",
        params: {
          item: item,
        },
      });
    },
    come(num) {
      let reg =
        num.toString().indexOf(".") > -1
          ? /(\d)(?=(\d{3})+\.)/g
          : /(\d)(?=(\d{3})+$)/g;

      return num.toString().replace(reg, "$1,");
    },
  },

  async created() {
    // window.addEventListener("popstate", (event) => {
    //   location.reload();
    // });
    this.url = this.$route.params.url;
    this.card = await this.requestList({
      jsonrpc: "2.0",
      id: "",
      method: "getBlock",
      params: [
        JSON.parse(this.url),
        {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        },
      ],
    });
    this.transactionArray = this.card?.transactions?.filter((item) => {
      return (
        !item.meta?.logMessages?.some((message) => message.includes("Vote")) ||
        !item.meta?.logMessages
      );
    });
    this.transaction = this.transactionArray?.length;
    this.historyData = await this.requestList({
      jsonrpc: "2.0",
      id: "",
      method: "getSlotLeaders",
      params: [JSON.parse(this.url), 3],
    });
    let successCount = [];
    for (let i in this.transactionArray) {
      if (this.transactionArray[i].meta.err == null) {
        successCount.push(this.transactionArray[i]);
      }
    }
    this.success = successCount.length;
    this.loading = true
  },
};
</script>
<script setup>
import {
  getCurrentInstance,
  ref,
  watchEffect,
} from 'vue';

import i18n from '@/i18n';

import { useAppStore } from '../../stores/index';

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
<template>
  <div style="width: 100%" v-if="loading">
    <div v-if="url != null">
      <div>
        <h3> {{ $t("blocks.title") }} </h3>
        <!-- <table> -->
        <card class="md-3">
          <card-body class="card-bodys">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td> {{ $t("transaction.overview") }} </td>
              <td class=" text-end"></td>
              </th>
              <tbody>
                <tr>
                  <td>{{ $t("blocks.blockhash") }} </td>
                  <td class="text-end">
                    {{ card?.blockhash ? card.blockhash : 'N/A' }} </td>
                </tr>
                <tr>
                  <td> {{ $t("blocks.title") }} </td>
                  <td class="text-end">{{ come(url) }}</td>
                </tr>
                <tr v-if="historyData">
                  <td>{{ $t("blocks.slot_leader") }} </td>
                  <td class="text-end text-theme">
                    <text style="cursor: pointer" @click="pubbleys(historyData[0])"> {{
                      historyData[0] }}</text>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t("transaction.timestamp") }}</td>
                  <td class="text-end"> {{ card?.blockTime ? timeSome2(card.blockTime) : 'N/A' }} </td>
                </tr>
                <tr>
                  <td>{{ $t("blocks.parent_blockhash") }}</td>
                  <td class="text-end text-theme">
                    <text v-if="card" style="cursor: pointer"
                      @click="pubbleys(card?.previousBlockhash ? card.previousBlockhash : '')"> {{
                        card?.previousBlockhash ? card.previousBlockhash : 'N/A' }} </text>
                    <text v-else> 'N/A' </text>
                  </td>
                </tr>
                <tr v-if="historyData">
                  <td>{{ $t("blocks.parent_slot") }}</td>
                  <td class="text-end text-theme">
                    <text style="cursor: pointer" @click="soltResult(JSON.parse(url) - 1)">{{
                      come(JSON.parse(url) - 1) }}</text>
                  </td>
                </tr>
                <tr v-if="historyData">
                  <td>{{ $t("blocks.parent_slot_leader") }}</td>
                  <td class="text-end text-theme">
                    <text style="cursor: pointer" @click="soltResult(JSON.parse(url) - 1)"> {{ historyData[1] }}
                    </text>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t("blocks.child_slot") }}</td>
                  <td class="text-end text-theme">
                    <text v-if="card" style="cursor: pointer" @click="soltResult(JSON.parse(url) + 1)"> {{
                      come(JSON.parse(url) + 1) }}</text>
                    <text v-else> N/A</text>
                  </td>
                </tr>
                <tr v-if="historyData">
                  <td>{{ $t("blocks.child_slot_leader") }}</td>
                  <td class="text-end text-theme">

                    <text style="cursor: pointer" @click="soltResult(JSON.parse(url) + 1)"> {{ historyData[2]
                      }}</text>
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div style="margin-top:50px">
        <!-- <ul class="nav nav-pills mb-3" id="pills-tab">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" href="#pills-home">{{
              $t("blocks.transctions") }}</a>
          </li>
        </ul> -->
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-home">
            <card class="md-3">
              <card-body class="card-bodys">
                <div class="tableHeader">
                  <h5>{{ $t("blocks.filtered_block_transactions") }}( {{ success }}/{{ transaction ? transaction : '0'
                    }} )
                  </h5>
                </div>
                <table>
                  <tbody style="width: 100%;"
                    class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <tr>
                      <th>#</th>
                      <th>{{ $t("transaction.result") }}</th>
                      <th>{{ $t("account.transaction_signature") }}</th>
                      <th>{{ $t("transaction.fee") }}</th>
                      <th class="text-end">{{ $t("blocks.invoked_programs") }}</th>
                    </tr>
                    <template v-if="card">
                      <tr v-for="(item, index) in transactionArray" :key="index"
                        style="border-bottom: 0.5px solid #141816;">
                        <td style="padding: 10px;"> {{ index + 1 }} </td>
                        <td>
                          <span :style="{ 'color': item.meta.err == null ? '#1BE17E' : 'red' }">
                            {{ item.meta.err == null ? $t("success") : $t("error") }}
                          </span>
                        </td>
                        <td class="text-theme">
                          <text style="cursor: pointer" class="text-theme"
                            @click="transtion(item.transaction.signatures[0])">{{
                              sliceSignature(item.transaction.signatures[0]) }}</text>
                        </td>
                        <td>
                          {{ toFexedStake(item.meta.fee) }}
                        </td>
                        <td>
                          <div v-for="(items, indexs) in programs(item.meta.logMessages)" :key="indexs"
                            class="text-theme"
                            style="cursor: pointer;display: flex;height:30px;line-height:30px;justify-content:end;">
                            <div @click="pubbleys(items.prc)">
                              {{ prchandle(items.prc) }}
                            </div>
                            <div style="font-size: 12px;margin:5px;line-height:20px">
                              [{{ items.num }}]
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>

                  </tbody>
                </table>
                <template v-if="!card">
                  <div class="text-center">
                    {{ $t("account.available") }}
                  </div>
                </template>
              </card-body>
            </card>
          </div>
        </div>
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
}
</style>