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
                            <th style=" text-align: left"> {{ $t("transactions.type") }}</th>
                            <th style=" text-align: left"> {{ $t("transactions.source") }} </th>
                            <th style=" text-align: left"> {{ $t("transactions.destination") }} </th>
                            <th style=" text-align: left">{{ $t("transactions.btg") }}</th>
                            <th style=" text-align: left"> {{ $t("token") }} </th>
                            <th style=" text-align: left"> {{ $t("transactions.time") }} </th>
                        </tr>
                        <tr v-for="(item, index) in arrayData" :key="index" style="height: 35px">
                            <td v-if="!props.boolean" style=" text-align: left; cursor: pointer" class="text-theme"
                                @click="
                                    pubbtx(
                                        item.signature
                                    )
                                    ">
                                {{
                                    item.signature
                                }}
                            </td>
                            <td v-else style=" text-align: left; cursor: pointer" class="text-theme" @click="
                                pubbtx(
                                    item.signature
                                )
                                ">
                                {{
                                    stringcate(item.signature)
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
                                    {{ textValue(item.type) }}
                                </button>
                            </td>
                            <td style=" text-align: left; cursor: pointer" class="text-theme" @click="
                                pubbleys(
                                    item.source
                                )
                                ">
                                {{ stringcate(
                                    titleUrl(item.source).url
                                ) }}
                                <img v-if="titleUrl(item.source).type && !titleUrl(item.source).assest"
                                    v-for="(datas, indexs) in titleUrl(item.source).certificates"
                                    :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.source).certificates"
                                    :key="indexs" :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>
                            </td>
                            <td style=" text-align: left; cursor: pointer" class="text-theme" @click="
                                pubbleys(
                                    item.destination
                                )
                                ">
                                {{ stringcate(
                                    titleUrl(item.destination).url
                                )
                                }}
                                <img v-if="titleUrl(item.destination).type && !titleUrl(item.destination).assest"
                                    v-for="(datas, indexs) in titleUrl(item.destination).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.destination).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>

                            </td>
                            <td style=" text-align: left">
                                {{ item.type == 'token_transfer' ? item.uiAmount :
                                    (typeof item.uiAmount == 'number' ? come(smartFormatNumber(item.uiAmount / 1000000000))
                                        :
                                        item.uiAmount) }}
                            </td>
                            <td style=" text-align: left;" @click="pubbleys(
                                item.type == 'token_transfer' ? item.mint : ''
                            )" :class="item.type == 'token_transfer' ? 'text-theme' : ''"
                                :style="item.type == 'token_transfer' ? 'cursor: pointer' : ''">
                                {{
                                    stringcate(
                                        item.mint
                                    )
                                }}
                            </td>
                            <td style=" text-align: left">
                                {{ timeFormatter(item.blockTime * 1000) }} &nbsp;
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </card-body>
    </card>
</template>

<script setup>
import {
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue';

import moment from 'moment';
import CountUp from 'vue-countup-v3';
import { useRouter } from 'vue-router';

import { useAppStore } from '@/stores/index';

import { solanapubbleys } from '../../components/method/solana';
import { titleUrl } from '../../components/method/title_url';
import { smartFormatNumber } from '../../components/number/smart.js';
import { order } from '../../request/order';

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
        const nullData = ref([]);
        for (let i in res) {

            if (res[i].result) {
                let etach = res[i].result.transaction.message.instructions;
                if (etach[etach.length - 1].parsed.type == "transfer" && etach[etach.length - 1].programId == "11111111111111111111111111111111") {
                    let data = {
                        type: "transfer",
                        signature: res[i].result.transaction.signatures[0],
                        source: etach[0].parsed.info.source,
                        destination: etach[0].parsed.info.destination,
                        uiAmount: etach[0].parsed.info.lamports,
                        mint: 'BTG',
                        blockTime: res[i].result.blockTime,
                    }
                    arrayData.value.push(data);
                } else if (etach[etach.length - 1].parsed.type == "transferChecked" && etach[etach.length - 1].programId == "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" || etach[etach.length - 1].programId == "Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c") {
                    console.log(etach);

                    let data = {
                        type: "token_transfer",
                        signature: res[i].result.transaction.signatures[0],
                        source: etach[etach.length - 1].parsed.info.source,
                        destination: etach[etach.length - 1].parsed.info.destination,
                        uiAmount: etach[etach.length - 1].parsed.info.tokenAmount ? etach[etach.length - 1].parsed.info.tokenAmount.uiAmount : 0,
                        mint: etach[etach.length - 1].parsed.info.mint,
                        blockTime: res[i].result.blockTime,
                    }
                    arrayData.value.push(data);
                } else if (etach[etach.length - 1].parsed.type == "delegate" && etach[etach.length - 1].programId == "Stake11111111111111111111111111111111111111") {
                    let data = {
                        type: "stake",
                        signature: res[i].result.transaction.signatures[0],
                        source: etach[etach.length - 1].parsed.info.stakeAuthority,
                        destination: etach[etach.length - 1].parsed.info.stakeAccount,
                        uiAmount: etach[0].parsed.info.lamports ? etach[0].parsed.info.lamports : 'N/A',
                        mint: 'BTG',
                        blockTime: res[i].result.blockTime,
                    }
                    arrayData.value.push(data);
                } else if (etach[etach.length - 1].parsed.type == "deactivate") {
                    let data = {
                        type: "unstake",
                        signature: res[i].result.transaction.signatures[0],
                        source: etach[etach.length - 1].parsed.info.stakeAuthority,
                        destination: etach[etach.length - 1].parsed.info.stakeAccount,
                        uiAmount: "N/A",
                        mint: 'BTG',
                        blockTime: res[i].result.blockTime,
                    }
                    arrayData.value.push(data);
                } else if (etach[etach.length - 1].parsed.type == "withdraw") {
                    let data = {
                        type: "withdraw",
                        signature: res[i].result.transaction.signatures[0],
                        source: etach[etach.length - 1].parsed.info.withdrawAuthority,
                        destination: etach[etach.length - 1].parsed.info.destination,
                        uiAmount: (etach[etach.length - 1].parsed.info.lamports),
                        mint: 'BTG',
                        blockTime: res[i].result.blockTime,
                    }
                    arrayData.value.push(data);
                } else {
                    nullData.value.push({ data: etach, index: i });
                }
            }
            // if (res[i].result && res[i].result.transaction.message.instructions.length < 3) {
            // arrayData.value.push(res[i].result.transaction);

            // }
        }
        console.log(arrayData.value);

        appStore.setTransaction(JSON.stringify(arrayData.value));
    } catch (err) {
        console.error("Error fetching order data:", err);
    }
};

const timeFormatter = (time) => {
    return moment(time).fromNow();
};

const stringcate = (str) => {
    if (str) {
        if (str.length < 10) {
            return str;
        } else {
            return str.slice(0, 5) + "..." + str.slice(-5);
        }
    } else {
        return 'N/A'
    }
};

const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}

const toFexedStake = (num) => {

    if (typeof num !== 'number') {

        return num;
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


    if (url) {
        router.push({
            name: "address",
            params: {
                url: url,
            },
        })
    }
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