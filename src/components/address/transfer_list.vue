<template>
    <div>
        <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small"
            style="overflow: auto;">
            <tbody>
                <tr>
                    <th>
                        {{ $t("account.signature") }}
                    </th>
                    <th>
                        {{ $t("account.movement") }}
                    </th>
                    <th>
                        {{ $t("account.primary") }}
                    </th>
                    <th>
                        {{ $t("account.quantity") }}
                    </th>
                    <th>
                        {{ $t("account.program") }}
                    </th>
                    <th>
                        {{ $t("account.destination") }}
                    </th>
                    <th>
                        {{ $t("account.Political") }}
                    </th>
                    <th>
                        {{ $t("account.time") }}
                    </th>
                </tr>
                <template v-if="loading && type">
                    <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                        <td class="text-theme">
                            <text style="cursor: pointer" @click="pubbtx(item.signature)">{{ stringcate(item.signature)
                            }}</text>
                        </td>
                        <td>
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
                                        item.movement
                                    )
                                }}
                            </button>
                        </td>
                        <td style=" text-align: left; " :class="item.primaryType ? 'color0-255-179-1' : 'text-theme'
                            ">
                            <!-- <text style="cursor: pointer" @click="slot(
                                item.primary
                            )">{{
                                titleUrl(item.primary).url

                            }}</text>

                            <img v-if="titleUrl(item.primary).type && titleUrl(item.primary).assest"
                                v-for="(datas, indexs) in titleUrl(item.primary).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">
                            <text v-for="items, indexs in titleUrl(item.primary).certificates" :key="indexs"
                                :style="'background-color: ' + items.backColor"
                                style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                {{ items.code }}
                            </text> -->
                            <RenderText v-if="item.primary" :address="item.primary" />


                        </td>
                        <td style=" text-align: left; " :class="item.quantityType ? 'color0-255-179-1' : 'text-theme'
                            ">
                            <!-- <text style="cursor: pointer" @click="slot(
                                item.quantity
                            )"> {{
                                titleUrl(item.quantity).url
                                }}</text>


                            <img v-if="titleUrl(quantity).type && titleUrl(item.quantity).assest"
                                v-for="(datas, indexs) in titleUrl(item.quantity).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">
                            <text v-for="items, indexs in titleUrl(item.quantity).certificates" :key="indexs"
                                :style="'background-color: ' + items.backColor"
                                style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                {{ items.code }}
                            </text> -->
                            <RenderText v-if="item.quantity" :address="item.quantity" />

                        </td>
                        <td style=" text-align: left;" class="text-theme">
                            <!-- <text style=" cursor: pointer" @click="slot(
                                item.program
                            )">{{
                                titleUrl(item.program).url

                            }}</text>

                            <img v-if="
                                !titleUrl(item.program).type && !titleUrl(program).assest" v-for="(datas, indexs) in
                                    titleUrl(item.program).certificates" :key="indexs" :src="datas.img" height="24"
                                class="marginRight8" alt="">
                            <text v-for="items, indexs in
                                titleUrl(item.program).certificates" :key="indexs"
                                :style="'background-color: ' + items.backColor"
                                style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                {{ items.code }}
                            </text> -->
                            <RenderText v-if="item.program" :address="item.program" />

                        </td>
                        <td>
                            {{ come(smartFormatNumber(
                                item.lamports / 1000000000
                            ))
                            }}
                        </td>
                        <td style=" text-align: left; ">
                            <!-- <text :style="item.token ? 'cursor: pointer' : ''" class="text-theme" @click="slot(
                                item.token
                            )">{{

                                item.token

                            }}</text>

                            <img v-if="titleUrl(item.token).type && !titleUrl(item.token).assest"
                                v-for="(datas, indexs) in titleUrl(item.token).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">
                            <text v-for="items, indexs in titleUrl(item.token).certificates" :key="indexs"
                                :style="'background-color: ' + items.backColor"
                                style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                {{ items.code }}
                            </text> -->
                            <RenderText v-if="item.token" :address="item.token" />

                        </td>

                        <td class="text-theme">
                            {{ item.time }}
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div v-if="!loading" class="text-center">
            <loading-vue v-if="true" />
        </div>
        <div v-if="historyData.length == 0 && loading" class="text-center">
            {{ $t("account.available") }}
        </div>
        <div class="justify-end padding-10" v-if="historyData.length != 0">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
                :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import {
    computed,
    onMounted,
    ref,
    watchEffect,
} from 'vue';

import moment from 'moment';
import { useRouter } from 'vue-router';
import RenderText from "../Render/text.vue"
import LoadingVue from '../../components/block/loading.vue';
import { smartFormatNumber } from '../../components/number/smart.js';
import { chainRequest } from '../../request/chain';
import { order } from '../../request/order';
import { solanapubbleys } from '../method/solana';
import { titleUrl } from '../method/title_url';

const router = useRouter();
const props = defineProps({
    url: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    }
})

const loading = ref(false);
const historyData = ref([]);

const currentPage = ref(1);
const pageSize = ref(20);
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    console.log(historyData.value[0]);

    return historyData.value.slice(start, end);
});
const totalItems = ref(0);

const type = ref(true);
const handlePageChange = (newPage) => {
    type.value = false;
    currentPage.value = newPage;
    setTimeout(() => {
        type.value = true;
    }, 1);
};
const toFexedStake = (num) => {
    if (num) {
        return JSON.parse((num / 1000000000).toFixed(2));
    }
};
const requestList = async (object) => {
    try {
        const response = await order(object);

        return response; // 现在这个函数会返回解析后的数据
    } catch (error) {
        console.error("Error fetching epoch info:", error);
        return []; // 返回一个空数组或抛出错误取决于你的需求
    }
}


onMounted(async () => {
    try {
        let res = await requestList('transactions/' + props.url);
        historyData.value = HandleList(res);
        totalItems.value = historyData.value.length;
        loading.value = true;
        // console.log(historyData.value);
        paginatedHistoryFunction(historyData.value);
    } catch {

    }
});
const ownerArray = ref([props.url]);

const HandleList = (listItem) => {
    console.log('原始数据:', listItem);
    let array = [];

    for (let i in listItem) {
        try {
            // 提取常用对象以简化代码
            const transaction = listItem[i]?.result?.transaction;
            if (!transaction) continue; // 跳过无效项

            const signatures = transaction.signatures;
            const instructions = transaction.message?.instructions || [];

            // 确保签名存在
            const signature = signatures?.[0];

            // 确保第一条指令存在且格式正确
            const firstInstruction = instructions?.[0];
            console.log(firstInstruction?.parsed?.type === "transfer" && firstInstruction?.parsed?.programId == "11111111111111111111111111111111");
            const movementType = firstInstruction?.parsed?.type === "transfer" && firstInstruction?.programId == "11111111111111111111111111111111"
                ? "Transfer"
                : "token_transfer";

            // 安全获取 primary 地址
            let primary = '';
            let quantity = '';
            let program = '';
            let lamports = 0;
            let primaryType = false;
            let quantityType = false;
            let owner = '';
            if (instructions.length === 1) {
                primary = firstInstruction?.parsed?.info?.source || '';
                // primaryType = props.type ? (firstInstruction?.parsed?.info?.source == props.url ? true : ((firstInstruction?.parsed?.info?.source == firstInstruction?.parsed?.info?.destination ? true : false))) : false;
                primaryType = false
                quantity = firstInstruction?.parsed?.info?.destination || '';
                // quantityType = props.type ? (firstInstruction?.parsed?.info?.source == props.url ? ((firstInstruction?.parsed?.info?.destination == props.url ? true : false)) : true) : false;
                quantityType = false;
                program = firstInstruction?.programId || '';
                lamports = firstInstruction?.parsed?.info?.tokenAmount ? firstInstruction?.parsed?.info?.tokenAmount?.amount : firstInstruction?.parsed?.info?.lamports;
                owner = firstInstruction?.parsed?.info?.source == firstInstruction?.parsed?.info?.destination ? firstInstruction?.parsed?.info?.destination : '';
            } else if (instructions.length >= 2) {
                primary = instructions[1]?.parsed?.info?.source || '';
                primaryType = false
                // primaryType = props.type ? (instructions[1]?.parsed?.info?.source == props.url ? true : (instructions[1]?.parsed?.info?.source == instructions[1]?.parsed?.info?.destination ? true : false)) : false;
                quantity = instructions[1]?.parsed?.info?.destination || '';
                // quantityType = props.type ? (instructions[1]?.parsed?.info?.source == props.url ? (instructions[1]?.parsed?.info?.destination == props.url ? true : false) : true) : false;
                quantityType = false;
                program = instructions[1]?.programId || '';
                lamports = instructions[1]?.parsed?.info?.tokenAmount ? instructions[1]?.parsed?.info?.tokenAmount?.amount : instructions[1]?.parsed?.info?.lamports;
                owner = instructions[1]?.parsed?.info?.source == instructions[1]?.parsed?.info?.destination ? instructions[1]?.parsed?.info?.owner : '';
            }
            let token = firstInstruction.parsed.info.mint ? titleUrl(firstInstruction.parsed.info.mint).url : 'BTG'
            let time = timeSome(listItem[i].result.blockTime)
            // 创建对象
            let obj = {
                signature,
                movement: movementType,
                primary,
                primaryType,
                quantity,
                quantityType,
                program,
                lamports,
                token,
                time,
                owner
            };

            // console.log('处理后的项:', obj);
            array.push(obj);

        } catch (error) {
            console.error(`处理索引 ${i} 时出错:`, error);
            continue; // 继续处理其他项
        }
    }
    console.log(array);
    for (let i in array) {
        const owner = array[i].owner;
        if (owner && !ownerArray.value.some(item => item === owner)) {
            ownerArray.value.push(owner);
        }
    }
    for (let j in array) {
        for (let i in ownerArray.value) {
            if (array[j].primary == ownerArray.value[i]) {
                array[j].primaryType = true;
            }
            if (array[j].quantity == ownerArray.value[i]) {
                array[j].quantityType = true;
            }
            if (!array[j].primaryType) {
                array[j].quantityType = true;
            }
        }
    }
    console.log('ownerArray:', ownerArray.value);

    console.log('处理后的数组:', array);
    console.log('函数执行完成');
    return array; // 返回处理后的数组
}

const textValue = (text) => {
    return text.toUpperCase();
};
const pubbtx = (item) => {
    router.push({
        name: "tx",
        params: {
            item: item,
        },
    });
};

const slot = (url) => {


    if (url) {
        router.push({
            name: "address",
            params: {
                url: url,
            },
        })
    }

};
const stringcate = (str) => {
    if (str.length < 10) {
        return str;
    } else {
        return str.slice(0, 5) + "..." + str.slice(-5);
    }
};
const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}

const timeSome = (time) => {
    return moment(time * 1000).fromNow();
}

</script>