<template>
    <div>
        <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
            <tbody>
                <tr>
                    <!-- <th>
                        {{ $t("mint") }}
                    </th> -->
                    <th>
                        {{ $t("mint_amount") }}
                    </th>
                    <th>
                        {{ $t("mint_price") }}
                    </th>
                    <th>
                        {{ $t("mint_rate") }}
                    </th>
                    <th>
                        {{ $t("mint_result") }}
                    </th>
                    <th>
                        {{ $t("mint_result_time") }}
                    </th>
                </tr>

                <template v-if="loading && type">
                    <tr v-for="(item, index) in paginatedHistoryData" :key="index">
                        <!-- <td class="text-theme">
                            <RenderText :address="item.mint" :type="true" :transactionType="true" />
                        </td> -->
                        <!-- <template v-if="item.account.data.parsed.info.stake"> -->
                        <td>
                            {{ smartFormatNumber(item.btgAmount / 1000000000) }} BTG
                            <!-- item.account.data.parsed.info.stake.delegation.voter -->
                        </td>
                        <!-- </template> -->
                        <td>
                            {{  smartFormatNumber(item.btgPrice) }}
                        </td>
                        <td>
                            {{ smartFormatNumber(item.outputRate) }}
                        </td>
                        <td>
                            {{ smartFormatNumber(item.outputTokenAmount / 1000000000) }} <img width="20" :src="  titleUrl(item.mint).find ? titleUrl(item.mint).img : ''  " alt=""> {{ titleUrl(item.mint).find ? titleUrl(item.mint).url : ''  }}
                        </td>
                        <td>
                            <!-- {{ item.time }} -->
                            {{ moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss') }}
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
    <div v-if="!loading" class="text-center">
        <loading-vue v-if="true" />
    </div>
    <div v-if="historyData.length == 0 && loading" class="text-center">
        {{ $t("account.available") }}
    </div>
    <div class="justify-end padding-10" v-if="historyData.length != 0">
        <!-- <el-pagination background :hide-on-single-page="true" :page-sizes="[25]" layout="prev, pager, next" :total="historyData.length" /> -->
        <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
            :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
    </div>
</template>
<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue';

import moment from 'moment';

import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

import LoadingVue from '../../components/block/loading.vue';
import { titleUrl } from '../../components/method/title_url';
// import RenderText from '../Render/text.vue';
import { smartFormatNumber } from '../../components/number/smart';

const type = ref(true);


// import { chainRequest } from '../../request/chain';

const props = defineProps({
    url: {
        type: String,
        default: ""
    },
})
const myAddress = ref(props.url);
const currentPage = ref(1);
const pageSize = ref(25);
const totalItems = ref(0);
const historyData = ref([]);
const loading = ref(false);

const handlePageChange = (newPage) => {
    type.value = false;
    currentPage.value = newPage;
    setTimeout(() => {
        type.value = true;
    }, 1);
};

const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return historyData.value.slice(start, end);
});


// 连接 Solana 网络
const connection = new Connection("https://rpc.openverse.network/", "confirmed");

// 手动解析 StakingVault 账户数据
function parseStakingVaultData(data) {
    // 跳过前8字节的 discriminator
    const accountData = data.slice(8);
    let offset = 0;

    // 解析各个字段
    const user = new PublicKey(accountData.slice(offset, offset + 32));
    offset += 32;

    const btgAmount = accountData.readBigUInt64LE(offset);
    offset += 8;

    const mint = new PublicKey(accountData.slice(offset, offset + 32));
    offset += 32;

    const tokenPrice = accountData.readDoubleLE(offset);
    offset += 8;

    const btgPrice = accountData.readDoubleLE(offset);
    offset += 8;

    const outputRate = accountData.readDoubleLE(offset);
    offset += 8;

    const outputTokenAmount = accountData.readBigUInt64LE(offset);
    offset += 8;

    const time = accountData.readBigInt64LE(offset);

    return {
        user: user.toBase58(),
        btgAmount: btgAmount.toString(),
        mint: mint.toBase58(),
        tokenPrice,
        btgPrice,
        outputRate,
        outputTokenAmount: outputTokenAmount.toString(),
        time: Number(time),
        stakingVault: '' // 需要外部传入
    };
}

// 查询质押记录
async function queryStakingRecords(userAddress) {
    try {
        const programId = new PublicKey('vrca8nDGAZW9R23jAerRJUqsd7vz1q3sqkKMxQsisxk');

        // 使用 getProgramAccounts 查询
        const accounts = await connection.getProgramAccounts(programId, {
            filters: [
                {
                    memcmp: {
                        offset: 8, // user 字段偏移量
                        bytes: userAddress, // 用户地址
                    },
                },
                {
                    dataSize: 120, // StakingVault 账户大小
                },
            ],
        });

        // 解析所有账户
        const stakingRecords = accounts.map(account => {
            const parsedData = parseStakingVaultData(account.account.data);
            return {
                ...parsedData,
                stakingVault: account.pubkey.toBase58(),
            };
        });

        let data = stakingRecords.sort((a, b) => {
            return b.time - a.time
        })
        console.log('data', data);

        return stakingRecords; // 按时间降序排序
    } catch (error) {
        console.error('查询质押记录失败:', error);
        return [];
    }
}
onMounted(async () => {
    // 使用示例
    const userWalletAddress = myAddress.value;
    const records = await queryStakingRecords(userWalletAddress);
    historyData.value = records;
    loading.value = true;
});

const percent = (num) => {

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
}


</script>