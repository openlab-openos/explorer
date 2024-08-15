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
      token: null,
      endUrl: null,
      domains: null,
      type: false
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
    timeSome(time) {
      return moment(time * 1000).fromNow();
    },
    async pubbleys(url) {
      this.url = url;
      this.card = await this.requestList({
        jsonrpc: "2.0",
        id: 1,
        method: "getMultipleAccounts",
        params: [
          [this.url],
          {
            commitment: "confirmed",
            encoding: "jsonParsed",
          },
        ],
      });
      if (this.card) {
        this.type = true
      } else {
        this.type = false

      }
      this.historyData = await this.requestList({
        jsonrpc: "2.0",
        id: "",
        method: "getConfirmedSignaturesForAddress2",
        params: [this.url, { limit: 25 }],
      });
      this.token = await this.requestList({
        jsonrpc: "2.0",
        id: "",
        method: "getTokenAccountsByOwner",
        params: [
          this.url,
          {
            programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          },
          {
            commitment: "confirmed",
            encoding: "jsonParsed",
          },
        ],
      });
    },
    async exexutable(url) {
      if (url == null) {
        router.go(-1);
        await this.pubbleys(this.endUrl);
      } else {
        router.push({
          name: "Address",
          params: { url: url },
        });
        await this.pubbleys(url);
      }
    },
    pubbtx(item) {
      this.$router.push({
        name: "tx",
        params: {
          item: item,
        },
      });
    },
    slot(url) {
      this.$router.push({
        name: "block",
        params: {
          url: url,
        },
      });
    },
    toFexedStake(num) {
      if (num) {
        return num / 1000000000;
      }
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
    this.endUrl = this.$route.params.url;
    await this.pubbleys(this.$route.params.url);
    this.domains = await this.requestList({
      jsonrpc: "2.0",
      id: "",
      method: "getProgramAccounts",
      params: [
        "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX",
        [
          {
            commitment: "confirmed",
            encoding: "base64",
            filters: [
              {
                memcmp: {
                  bytes: "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx",
                  offset: 32,
                },
              },
              {
                memcmp: {
                  bytes: this.endUrl,
                  offset: 32,
                },
              },
            ],
          },
        ],
      ],
    });
  },
  async mounted() { },
};
</script>
<template>
  <div style="width: 100%">
    <div v-if="url != null">
      <h3>Account</h3>
      <div v-if="type">

        <card class="md-3 ">
          <card-body class="card-bodys">
            <table v-if="this.card"
              class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>Overview</td>
              <td class=" text-end"></td>
              </th>
              <tbody v-for="(item, index) in this.card.value[0] == null ? 1 : this.card.value" :key="index">
                <tr>
                  <td>Address</td>
                  <td class="text-end">{{ this.url }}</td>
                </tr>
                <tr>
                  <td>Balance(BTG)</td>
                  <td class="text-end"> {{ this.card.value[index] == null ? 'Account does not exist' :
                    come(toFexedStake(item.lamports)) }} </td>
                </tr>
                <tr>
                  <td>Allocated Data Size</td>
                  <td class="text-end"> {{ this.card.value[index] == null ? '0' : item.space }} byte(s)</td>
                </tr>
                <tr>
                  <td>Assigned Program Id</td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="exexutable(item.owner)">
                    {{ item.executable ? 'Native Loader' : ' System Program' }}</td>
                </tr>
                <tr>
                  <td>Executable</td>
                  <td class="text-end"> {{ this.card.value[index] == null ? 'NO' : (item.executable ? 'YES' : 'NO') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div v-if="!type">
        <card class="md-3">
          <card-body class="card-bodys">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>Overview</td>
              <td class=" text-end"></td>
              </th>
              <tbody>
                <tr>
                  <td>Address</td>
                  <td class="text-end">{{ this.url }}</td>
                </tr>
                <tr>
                  <td>Balance(BTG)</td>
                  <td class="text-end"> Address is not vaild </td>
                </tr>
                <tr>
                  <td>Allocated Data Size</td>
                  <td class="text-end"> 0 byte(s)</td>
                </tr>
                <tr>
                  <td>Assigned Program Id</td>
                  <td class="text-end text-theme" style="cursor: pointer">
                    Native Loader</td>
                </tr>
                <tr>
                  <td>Executable</td>
                  <td class="text-end"> NO
                  </td>
                </tr>
              </tbody>
            </table>
          </card-body>
        </card>
      </div>
      <div style="margin-top:50px" v-if="type">
        <ul class="nav nav-pills mb-3" id="pills-tab">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" href="#pills-home">History</a>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-home">
            <card class="md-3">
              <card-body class="card-bodys">
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                  <tbody>
                    <tr>
                      <th style="width: 70%;">
                        TRANSACTION SIGNATURE
                      </th>
                      <th style="width: 10%;">
                        BLOCK
                      </th>
                      <th style="width: 10%;">
                        AGM
                      </th>
                      <th style="width: 10%;">
                        RESULT
                      </th>
                    </tr>
                    <tr v-for="(item, index) in historyData" :key="index">
                      <td class="text-theme" style="width: 70%;cursor: pointer" @click="pubbtx(item.signature)">
                        {{ item.signature }}
                      </td>
                      <td class="text-theme" style="width: 10%;cursor: pointer" @click="slot(item.slot)">
                        {{ come(item.slot) }}
                      </td>
                      <td style="width: 10%;">
                        {{ timeSome(item.blockTime) }}
                      </td>
                      <td style="width: 10%;">
                        {{ item.err == null ? 'Success' : 'Failed' }}
                      </td>
                    </tr>
                    <tr v-show="historyData < 0">
                      1
                    </tr>
                  </tbody>
                </table>
              </card-body>
            </card>
          </div>
          <div class="tab-pane fade" id="pills-profile">
            <div v-if="this.token">
              <div v-show="this.token.value.length !== 0">
                <table>
                  <tbody>
                    <tr>
                      <th>
                        MINT
                      </th>
                      <th>
                        TYPE
                      </th>
                      <th>
                        LAMPORTS
                      </th>
                    </tr>
                    <tr v-for="item, index in this.token.value" :key=index>
                      <td>
                        {{ item.account.data.parsed.mint }}
                      </td>
                      <td>
                        {{ item.account.data.type }}
                      </td>
                      <td>
                        {{ item.account.lamports }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-show="this.token.value.length == 0">No token holdings found</div>

            </div>
          </div>
          <div class="tab-pane fade" id="pills-contact">No found</div>
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