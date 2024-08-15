<script>
import { useAppOptionStore } from "@/stores/app-option";
import { chainRequest } from "../../request/chain";
import moment from "moment";
import router from "../../router";

const appOption = useAppOptionStore();

export default {
  data() {
    return {
      url: null,
      card: null,
      historyData: null,
      type: null,
      transaction: null,
      transactionArray: null,
      success: null,
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
      return item.slice(0, 50) + "...";
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
      });
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
          location.reload();
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
    window.addEventListener("popstate", (event) => {
      location.reload();
    });
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
    this.transactionArray = this.card.transactions.filter((item) => {
      return (
        !item.meta?.logMessages?.some((message) => message.includes("Vote")) ||
        !item.meta?.logMessages
      );
    });
    this.transaction = this.transactionArray.length;
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
  },
};
</script>
<template>
  <div style="width: 100%">
    <div width="50%" style="
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
      " v-if="url == null">
      <form v-on:submit.prevent="submitForm()" method="POST" name="login_form" style="width: 50%">
        <h1 class="text-center">Search</h1>
        <div class="text-inverse text-opacity-50 text-center mb-4"></div>
        <div class="mb-3">
          <label class="form-label">Email Address <span class="text-danger">*</span></label>
          <input type="text" class="form-control form-control-lg bg-white bg-opacity-5" value="" placeholder="" />
        </div>
        <button type="submit" class="btn btn-outline-theme btn-lg d-block w-100 fw-500 mb-3">
          Search
        </button>
      </form>
    </div>
    <div v-if="url != null">
      <div>
        <h3>Block</h3>
        <!-- <table> -->
        <caed class="md-3">
          <card-body class="card-bodys">
            <table v-if="this.card"
              class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>Overview</td>
              <td class=" text-end"></td>
              </th>
              <tbody>
                <tr>
                  <td>Blockhashds</td>
                  <td class="text-end"> {{ this.card.blockhash }} </td>
                </tr>
                <tr>
                  <td>Block</td>
                  <td class="text-end">{{ come(this.url) }}</td>
                </tr>
                <tr v-if="this.historyData">
                  <td>Slot Leader</td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="pubbleys(this.historyData[0])"> {{
                    this.historyData[0] }}
                  </td>
                </tr>
                <tr>
                  <td>Timestamp</td>
                  <td class="text-end"> {{ timeSome2(this.card.blockTime) }} </td>
                </tr>
                <tr>
                  <td>Parent Blockhash</td>
                  <td class="text-end text-theme" style="cursor: pointer"
                    @click="pubbleys(this.card.previousBlockhash)"> {{ this.card.previousBlockhash }} </td>
                </tr>
                <tr v-if="this.historyData">
                  <td>Parent Slot</td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="soltResult(JSON.parse(this.url) - 1)">
                    {{ come(JSON.parse(this.url) - 1) }} </td>
                </tr>
                <tr v-if="this.historyData">
                  <td>Parent Slot Leader</td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="pubbleys(this.historyData[1])">
                    {{ this.historyData[1] }} </td>
                </tr>
                <tr>
                  <td>Child Slot</td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="soltResult(JSON.parse(this.url) + 1)">
                    {{ come(JSON.parse(this.url) + 1) }}</td>
                </tr>
                <tr v-if="this.historyData">
                  <td>Child Slot Leader</td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="pubbleys(this.historyData[2])">
                    {{ this.historyData[2] }}</td>
                </tr>
                <!-- <tr>
              <td>Processed Transactions</td>
              <td class="text-end"> {{this.card.transactions.length}}</td>
            </tr>
            <tr>
              <td>Successful Transactions</td>
              <td class="text-end text-theme"> {{Successful(this.card.transactions)}}</td>
            </tr> -->
              </tbody>
            </table>
          </card-body>
        </caed>
      </div>
      <div style="margin-top:50px">
        <ul class="nav nav-pills mb-3" id="pills-tab">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" href="#pills-home">Transctions</a>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div class="tableHeader">
            <h5>Filtered Block Transactions( {{ success }}/{{ transaction }} )</h5>
          </div>
          <div class="tab-pane fade show active" id="pills-home">
            <card class="md-3">
              <card-body class="card-bodys">
                <table v-if="card">
                  <tbody style="width: 100%;"
                    class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <tr>
                      <th>#</th>
                      <th>RESULT</th>
                      <th>Transaction Signature</th>
                      <th>Fee</th>
                      <th class="text-end">Invoked Programs</th>
                    </tr>
                    <tr v-for="(item, index) in transactionArray" :key="index"
                      style="border-bottom: 0.5px solid #141816;">
                      <td style="padding: 10px;"> {{ index + 1 }} </td>
                      <td>
                        <span :style="{ 'color': item.meta.err == null ? '#1BE17E' : 'red' }">
                          {{ item.meta.err == null ? "success" : "error" }}
                        </span>
                      </td>
                      <td class="text-theme" style="cursor: pointer" @click="transtion(item.transaction.signatures[0])">
                        {{ sliceSignature(item.transaction.signatures[0]) }}
                      </td>
                      <td>
                        {{ toFexedStake(item.meta.fee) }}
                      </td>
                      <td>
                        <div v-for="(items, indexs) in programs(item.meta.logMessages)" :key="indexs" class="text-theme"
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
                  </tbody>
                </table>
              </card-body>
            </card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}
</style>