<template>
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
                            <th style=" text-align: left">{{ $t("transactions.btg") }}</th>
                            <th style=" text-align: left"> {{ $t("token") }} </th>
                            <th style=" text-align: left"> {{ $t("transactions.type") }}</th>
                            <th style=" text-align: left"> {{ $t("transactions.time") }} </th>
                        </tr>
                        <tr v-for="(product, index) in arrayData" :key="index" style="height: 35px">
                            <td v-if="props.boolean" style=" text-align: left; cursor: pointer" class="text-theme"
                                @click="
                                    pubbtx(
                                        product.signatures[0]
                                    )
                                    ">
                                {{
                                    stringcate(
                                        promaster[product.signatures[0]] ?
                                            promaster[product.signatures[0]].name :
                                            product.signatures[0]
                                    )
                                }}
                            </td>
                            <td v-else style=" text-align: left; cursor: pointer" class="text-theme" @click="
                                pubbtx(
                                    product.signatures[0]
                                )
                                ">
                                {{
                                    promaster[product.signatures[0]] ?
                                        promaster[product.signatures[0]].name :
                                        product.signatures[0]
                                }}
                            </td>
                            <td style=" text-align: left; cursor: pointer" class="text-theme" @click="
                                pubbleys(
                                    product.message.instructions[0].parsed
                                        .info.source
                                )
                                ">
                                {{ stringcate(
                                    titleUrl(product.message.instructions[0].parsed.info.source)
                                ) }}
                            </td>
                            <td style=" text-align: left; cursor: pointer" class="text-theme" @click="
                                pubbleys(
                                    product.message.instructions[0].parsed
                                        .info.destination
                                )
                                ">
                                {{
                                    stringcate(
                                        titleUrl(product.message.instructions[0]
                                                    .parsed.info.destination)
                                    )
                                }}
                            </td>
                            <td style=" text-align: left">
                                {{
                                    product.message.instructions[0]
                                        .parsed.info.mint ? product.message.instructions[0]
                                            .parsed.info.tokenAmount.uiAmount : toFexedStake(
                                                product.message.instructions[0].parsed
                                                    .info.lamports
                                            )

                                }}
                            </td>
                            <td style=" text-align: left;" :style="product.message.instructions[0]
                                .parsed.info.mint ? 'cursor: pointer' : ''" class="text-theme" @click="pubbleys(
                                                product.message.instructions[0]
                                                    .parsed.info.mint ? product.message.instructions[0]
                                                        .parsed.info.mint : ''
                                            )">
                                {{
                                    stringcate(
                                        product.message.instructions[0]
                                            .parsed.info.mint ? product.message.instructions[0]
                                                .parsed.info.mint : "BTG"
                                    )
                                }}
                            </td>
                            <td style=" text-align: left">
                                <button type="button" style="
                      height: 20px;
                      padding: 0;
                      padding: 0px 8px;
                      border: 1px solid #3cd2a5;
                      background-color: #212b38;
                      color: #3cd2a5;
                      border-radius: 2px;
                      line-height: 18px;
                      text-align: center;
                      cursor: auto;">
                                    {{
                                        textValue(
                                            product.message.instructions[0]
                                                .parsed.type == "transfer" ? "Transfer" : "token_transfer"
                                        )
                                    }}
                                </button>
                            </td>
                            <td style=" text-align: left">
                                {{ timeFormatter(orderData[index].result.blockTime * 1000) }} &nbsp;
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </card-body>
    </card>
</template>

<script setup>
import { order } from "../../request/order";
import { ref, onMounted, getCurrentInstance } from "vue";
import { useAppStore } from "@/stores/index";
import CountUp from "vue-countup-v3";
import moment from "moment";
import { useRouter } from "vue-router";
import { solanapubbleys } from "../../components/method/solana"
import {titleUrl} from "../../components/method/title_url";
const props = defineProps({
    boolean: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();

const appStore = useAppStore();

const orderData = ref([]);
const apps = getCurrentInstance();

const promaster = ref(apps?.proxy?.$progream);

onMounted(() => {
    fetchOrderData();
});
const arrayData = ref([]);
const fetchOrderData = async () => {
    try {
        const res = await order("new_transactions");
        for (let i in res) {
            if (res[i].result) {
                arrayData.value.push(res[i].result.transaction)
            }
        }

        orderData.value = res.filter(item => item.result != null);

        appStore.setTransaction(JSON.stringify(orderData.value));
    } catch (err) {
        console.error("Error fetching order data:", err);
    }
};

const timeFormatter = (time) => {
    return moment(time).fromNow();
};

const stringcate = (str) => {
    if (str.length < 10) {
        return str;
    } else {
        return str.slice(0, 5) + "..." + str.slice(-5);
    }
};

const toFexedStake = (num) => {
    if (num) {
        return JSON.parse((num / 1000000000).toFixed(2));
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
    })
};

const pubbtx = (item) => {
    router.push({
        name: "tx",
        params: {
            item: item,
        },
    });
};

</script>