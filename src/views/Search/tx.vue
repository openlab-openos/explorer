<script>
import { useAppOptionStore } from "@/stores/app-option";
import { chainRequest } from "../../request/chain";
import moment from "moment";

const appOption = useAppOptionStore();

export default {
  data() {
    return {
      url: null,
      card: null,
      historyData: null,
      type: null,
      preType: false,
      raw: true,
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
      let reg =
        num.toString().indexOf(".") > -1
          ? /(\d)(?=(\d{3})+\.)/g
          : /(\d)(?=(\d{3})+$)/g;

      return num.toString().replace(reg, "$1,");
    },
    pubbleys(url) {
      this.$router.push({
        name: "address",
        params: {
          url: url,
        },
      });
    },
    dataDeal(item, data) {
      if (item.split(" ")[1] == data) {
        if (/^\d+$/.test(item.split(" ")[1])) {
          return {
            name: item.split(" ")[0],
            type: "invoked",
            value: "System Program",
          };
        } else {
          return {
            name: item.split(" ")[0],
            type: "invoked",
            value: item.split(" ")[1],
          };
        }
      }
    },
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
    if (this.historyData.meta.logMessages[0].includes("Vote")) {
      this.preType = true;
    }
  },
};
</script>
<template>
  <div style="width: 100%">
    <div
      width="50%"
      style="
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
      "
      v-if="url == null"
    >
      <form
        v-on:submit.prevent="submitForm()"
        method="POST"
        name="login_form"
        style="width: 50%"
      >
        <h1 class="text-center">Search</h1>
        <div class="text-inverse text-opacity-50 text-center mb-4"></div>
        <div class="mb-3">
          <label class="form-label"
            >Email Address <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control form-control-lg bg-white bg-opacity-5"
            value=""
            placeholder=""
          />
        </div>
        <button
          type="submit"
          class="btn btn-outline-theme btn-lg d-block w-100 fw-500 mb-3"
        >
          Search
        </button>
      </form>
    </div>
    <div v-if="url != null">
      <div>
        <h3>Transaction</h3>
        <!-- <table> -->
        <table v-if="this.card">
          <th>
              <td>Overview</td>
              <td class=" text-end" ></td>
            </th>
          <tbody v-if="historyData">
            <tr>
              <td>Signature</td>
              <td class="text-end">{{ this.url }}</td>
            </tr>
            <tr>
              <td>Result</td>
              <td class="text-end" :style="{'color': card.value[0].err == null ? '#1BE17E' : 'red'}">{{ card.value[0].err == null ? 'Success' : 'Failed' }}</td>
            </tr>
            <tr>
                <td>Timestamp</td>
                <td class="text-end"> {{timeSome2(historyData.blockTime)}} </td>
            </tr>
            <tr>
              <td> Confirmation Status </td>
              <td class="text-end"> {{textValue(card.value[0].confirmationStatus)}} </td>
            </tr>
            <tr>
              <td>Slot</td>
              <td class="text-end"> {{come(card.value[0].slot)}} </td>
            </tr>
            <tr>
              <td>Recent Blockhash</td>
              <td class="text-end text-theme"> {{ historyData.transaction.message.accountKeys[0].pubkey}} </td>
            </tr>
            <tr>
              <td>Fee (BTG)</td>
              <td class="text-end"> {{toFexedStake(historyData.meta.fee)}} </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top:50px">
        <h4>Account Input(s)</h4>
        <table v-if="historyData">
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
                        POST BALLANCE(BTG)
                    </th>
                    <th>
                        DETAILS
                    </th>
                </tr>
                <tr v-for="item,index in historyData.transaction.message.accountKeys" :key="index">
                     <td>
                        {{index + 1}}
                    </td>
                    <td class="text-theme" style="cursor: pointer" @click="pubbleys(item.pubkey)" >
                        {{item.pubkey}}
                    </td>
                    <td>
                        {{item.signer? toFexedStake(historyData.meta.fee) : 0}}
                    </td>
                    <td>
                        {{come(toFexedStake(historyData.meta.postBalances[index]))}}
                    </td>
                    <td style="text-align: left;font-size: 12px;">
                       <span v-if="item.signer ? (item.writable ? true : false ) : false " class="dage bg-info" >Fee Payer</span>
                       <span v-if="item.signer" class="dage bg-info" >Signer</span>
                       <span v-if="item.writable" class="dage bg-solt" >Writable</span>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
      <div style="margin-top:50px" v-if="preType">
        <h4>Instruction</h4>
        <table>
            <tbody v-if="historyData">
                <tr>
                    <td style="width:50%">Instruction Data (JSON)</td>
                    <td style="width:50%"> 
                        <pre style="background-color: #18202C;border:none;color:#fff;line-height:15px">
                            {{historyData.transaction.message.instructions[0].parsed}}
                        </pre>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
      <div style="margin-top:50px" v-if="!preType" >
        <div v-if="historyData">
          <div style="width:100%;display:flex;justify-content: space-between;">
            <h4>Program Instruction Logs</h4>
            <div>
              <span style="cursor: pointer" @click="raw = !raw">Raw</span>
            </div>
          </div>
          <div v-if="raw">
              <div v-for="(item,index) in historyData.transaction.message.instructions" :key="index" >
              <div style="display:flex;">
                <span
                style="color:#26E97E;background-color:#116939;" class="dage" ># {{index+1}}</span> <h6 style="margin:0;">{{textValue(item.parsed.type)}}</h6>
              </div>
              <div>
                <ul>
                  <li v-for="(items,indexs) in historyData.meta.logMessages" :key="indexs">
                    {{dataDeal(items,item.programId).name}} &nbsp;{{dataDeal(items,item.programId).type}} &nbsp;{{dataDeal(items,item.programId).value}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="!raw">
            <pre style="background-color: #18202C;border:none;color:#fff;line-height:15px">
                            {{
                               historyData.transaction.message.instructions[0]
                            }}
                        </pre>
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
tr {
  line-height: 50px;
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
</style>