<template>
  <div style="width: 100%">
    <card class="mb-3">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1"> {{ $t("transactions.title") }} </span>
          <card-expand-toggler />
        </div>
        <div class="table-responsive">
          <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
            <tbody>
              <tr>
                <th style=" text-align: left"> {{ $t("transactions.signature") }} </th>
                <th style=" text-align: left"> {{ $t("transactions.source") }} </th>
                <th style=" text-align: left"> {{ $t("transactions.destination") }} </th>
                <th style=" text-align: left">BTG</th>
                <th style=" text-align: left"> {{ $t("type") }} </th>
                <th style=" text-align: left"> {{ $t("blocks.slot") }} </th>
                <th style=" text-align: left"> {{ $t("time") }} </th>
              </tr>
              <tr v-for="(product, index) in orderData" :key="index" style="height: 35px">
                <td style=" text-align: left; cursor: pointer" class="text-theme" @click="
                  pubbtx(
                    product.result.transaction.signatures[0]
                  )
                  ">
                  {{
                    promaster[product.result.transaction.signatures[0]] ?
                      promaster[product.result.transaction.signatures[0]].name : product.result.transaction.signatures[0]

                  }}
                </td>
                <td style=" text-align: left; cursor: pointer" class="text-theme" @click="
                  pubbleys(
                    product.result.transaction.message.instructions[0].parsed
                      .info.source
                  )
                  ">
                  {{
                    stringcate(
                      promaster[product.result.transaction.message.instructions[0]
                        .parsed.info.source] ? promaster[product.result.transaction.message.instructions[0]
                          .parsed.info.source].name : product.result.transaction.message.instructions[0]
                            .parsed.info.source
                    )
                  }}
                </td>
                <td style=" text-align: left; cursor: pointer" class="text-theme" @click="
                  pubbleys(
                    product.result.transaction.message.instructions[0].parsed
                      .info.destination
                  )
                  ">
                  {{
                    stringcate(
                      promaster[product.result.transaction.message.instructions[0]
                        .parsed.info.destination] ? promaster[product.result.transaction.message.instructions[0]
                          .parsed.info.destination].name : product.result.transaction.message.instructions[0]
                            .parsed.info.destination
                    )
                  }}
                </td>
                <td style=" text-align: left">
                  {{
                    toFexedStake(
                      product.result.transaction.message.instructions[0].parsed
                        .info.lamports
                    )
                  }}
                </td>
                <td style=" text-align: left">
                  <button type="button" style="
                      width: 80px;
                      height: 20px;
                      padding: 0;
                      border: 1px solid #3cd2a5;
                      background-color: #212b38;
                      color: #3cd2a5;
                      border-radius: 2px;
                      line-height: 18px;
                      text-align: center;
                      cursor: auto;

                    ">
                    {{
                      textValue(
                        product.result.transaction.message.instructions[0]
                          .parsed.type
                      )
                    }}
                  </button>
                </td>
                <td class="text-theme" style=" text-align: left; cursor: pointer"
                  @click="soltResult(product.result.slot)">
                  <count-up duration="3" :startVal="product.result.slot" :end-val="product.result.slot"></count-up>
                  <!-- {{ product.result.slot }} -->
                </td>

                <td style=" text-align: left">
                  {{ timeFormatter(product.result.blockTime * 1000) }} &nbsp;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </card-body>
    </card>
  </div>
</template>

<script setup>
import { useAppStore } from "../../stores/index";
import { ref, getCurrentInstance,watchEffect } from "vue";
import moment from "moment";
import CountUp from "vue-countup-v3";
import { useRouter } from "vue-router";
import i18n from "@/i18n"

const apps = getCurrentInstance()

const promaster = ref(apps?.proxy?.$progream);

const router = useRouter();

const appStore = useAppStore();

const orderData = ref(JSON.parse(appStore.Transaction));

// 语言
function selectLanguage(indexValue){
  i18n.global.locale = indexValue;
}

watchEffect(()=>{
  selectLanguage(appStore.$state.language);
})

const stringcate = (str) => {
  return str.slice(0, 6) + "..." + str.slice(-6);;
};

const timeFormatter = (time) => {
  return moment(time).fromNow();
};

const toFexedStake = (num) => {
  if (num) {
    return (num / 1000000000).toFixed(2);
  }
};

const textValue = (text) => {
  return text.toUpperCase();
};

const soltResult = (solt) => {
  router.push({
    name: "block",
    params: {
      url: solt,
    },
  });
};

const pubbleys = (url) => {
  router.push({
    name: "address",
    params: {
      url: url,
    },
  });
};
const pubbtx = (item) => {
  router.push({
    name: "tx",
    params: {
      item: item,
    },
  });
}
</script>
