<script setup>
import { getCurrentInstance, ref ,watchEffect} from "vue";
import i18n from "@/i18n"
import { useAppStore } from "../../stores/index";
const appStore = useAppStore();

const apps = getCurrentInstance()
const promaster = apps?.proxy?.$progream;
// 语言
function selectLanguage(indexValue){
  i18n.global.locale = indexValue;
}

watchEffect(()=>{
  selectLanguage(appStore.$state.language);
})
</script>
<script>
import { useAppOptionStore } from "@/stores/app-option";
import { chainRequest } from "../../request/chain";
import moment from "moment";
import router from "../../router";
import LoadingVue from "../../components/block/loading.vue"


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
      token: null,
      endUrl: null,
      type: false,
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
          name: "address",
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
    this.loading = true
  },
  watch: {
    async $route(to, from) {
      this.loading = false
      this.endUrl = this.$route.params.url;
      await this.pubbleys(this.$route.params.url);
      this.loading = true
    }
  },
  async mounted() { },
};
</script>
<template>
  <div style="width: 100%" v-if="loading">
    <div>
      <h3> {{ $t("account.title") }} </h3>
      <div v-if="type">

        <card class="md-3 ">
          <card-body class="card-bodys">
            <table v-if="card" class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
              <th>
              <td>{{ $t("account.overview") }} </td>
              <td class=" text-end"></td>
              </th>
              <tbody v-for="(item, index) in card.value[0] == null ? 1 : card.value" :key="index">
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
                  <td class="text-end"> {{ card.value[index] == null ? 'Account does not exist' :
                    come(toFexedStake(item.lamports)) }} </td>
                </tr>
                <tr>
                  <td>{{ $t("account.allocated_data_size") }} </td>
                  <td class="text-end"> {{ card.value[index] == null ? '0' : item.space }} byte(s)</td>
                </tr>
                <tr>
                  <td>{{ $t("account.assigned_program_id") }} </td>
                  <td class="text-end text-theme" style="cursor: pointer" @click="exexutable(item.owner)">
                    {{ item.executable ? 'Native Loader' : ' System Program' }}</td>
                </tr>
                <tr>
                  <td>{{ $t("account.executable") }} </td>
                  <td class="text-end"> {{ card.value[index] == null ? 'NO' : (item.executable ? 'YES' : 'NO') }}
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
      <div style="margin-top:50px" v-if="type">
        <ul class="nav nav-pills mb-3" id="pills-tab">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" href="#pills-home"> {{ $t("dashboard.history") }} </a>
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
                        {{ $t("account.transaction_signature") }}
                      </th>
                      <th style="width: 10%;">
                        {{ $t("blocks.title") }}
                      </th>
                      <th style="width: 10%;">
                        {{ $t("account.age") }}
                      </th>
                      <th style="width: 10%;">
                        {{ $t("account.result") }}
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
            <div v-if="token">
              <div v-show="token.value.length !== 0">
                <table>
                  <tbody>
                    <tr>
                      <th>
                        {{ $t("account.mini") }}<
                      </th>
                      <th>
                        {{ $t("type") }}<
                      </th>
                      <th>
                        {{ $t("account.lamports") }}<
                      </th>
                    </tr>
                    <tr v-for="item, index in token.value" :key=index>
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
              <div v-show="token.value.length == 0">{{ $t("account.token_error") }}</div>
            </div>
          </div>
          <div class="tab-pane fade" id="pills-contact">{{ $t("account.not_found") }}</div>
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