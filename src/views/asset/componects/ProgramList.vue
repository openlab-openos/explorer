<template>
    <div class="marginTOP-50">
        <card class="md-3">
            <card-body class="card-bodys">
                <div class="d-flex fw-bold small mb-3">
                    <span class="flex-grow-1"> {{ $t("navigation.TokenTracker") }} </span>
                    <card-expand-toggler />
                </div>
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                    <tbody>
                        <tr>
                            <th style="text-align: left"> {{ $t("tokens.title") }} </th>
                            <th style="text-align: left"> {{ $t("tokens.symbol") }} </th>
                            <th style="text-align: left"> {{ $t("holders") }}</th>
                            <th style="text-align: left"> {{ $t("dashboard.supply") }}</th>
                        </tr>
                        <!-- 加载状态 -->
                        <tr v-if="!loading && paginatedHistoryData.length === 0">
                            <td colspan="4" class="text-center">
                                <LoadingVue />
                            </td>
                        </tr>
                        <!-- 数据列表 -->
                        <tr v-for="item in paginatedHistoryData" :key="item.state.mint">
                            <td class="text-theme">
                                <img :src="item.imageUrl" @error="item.imageUrl = defaultImage" height="24" alt=""
                                    class="marginRight8">
                                <text style="cursor: pointer;" @click="pubbleys(item.state.mint)">
                                    {{ item.state.name }}
                                </text>
                            </td>
                            <td>
                                {{ item.state.symbol || 'N/A' }}
                            </td>
                            <td>
                                <!-- 显示加载状态或实际数量 -->
                                {{ holdersCache[item.state.mint] === null ? 'loading...' : holdersCache[item.state.mint]
                                }}
                            </td>
                            <td>
                                <!-- {{ item.supply / item.decimals }} -->
                                  {{ come(smartFormatNumber(toFexedStake(item.supply, item.decimals))) }}
                                <!-- {{ come(smartFormatNumber(JSON.parse(item.supply).toFixed(item.decimals))) }} -->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- 分页控件 -->
                <div v-if="loading && totalItems > 0" class="justify-end padding-10">
                    <el-pagination background layout="prev, pager, next" :hide-on-single-page="false"
                        :current-page="currentPage" :page-size="pageSize" :total="totalItems"
                        @current-change="handlePageChange" />
                </div>
                <!-- 无数据状态 -->
                <div v-if="loading && totalItems === 0" class="text-center">
                    {{ $t("account.available") }}
                </div>
            </card-body>
        </card>
    </div>
</template>

<script setup>
import { tokenList, getTokenAccounts } from "./Program.js";
import { ref, computed, watchEffect } from "vue";
import LoadingVue from '../../../components/block/loading.vue';
import { useRouter } from 'vue-router';
import { smartFormatNumber } from '../../../components/number/smart';

// 路由实例
const router = useRouter();

// 响应式状态
const historyData = ref([]); // 原始数据列表
const currentPage = ref(1); // 当前页码
const pageSize = ref(30); // 每页条数
const totalItems = ref(0); // 总条数
const loading = ref(false); // 数据加载状态
const holdersCache = ref({}); // 缓存持有人数量：{ mint: 数量 }
const defaultImage = 'https://r2.boss.top/images/20250606/bvxDCiRTIturmM0IwWtzWl89Ier8XJd27XqRpdHR.png'; // 默认图片

// 分页计算属性（纯同步，只处理分页逻辑）
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return historyData.value.slice(start, end);
});

// 异步获取单个代币的持有人数量并缓存
const fetchHolderCount = async (mint) => {
    // 已缓存则直接返回
    if (holdersCache.value[mint] !== undefined) return;

    // 先标记为加载中
    holdersCache.value[mint] = null;

    try {
        const res = await getTokenAccounts(mint);
        console.log(res, '0000---000');

        holdersCache.value[mint] = res; // 假设res是账户数组，取长度
    } catch (error) {
        console.error(`获取${mint}持有人失败:`, error);
        holdersCache.value[mint] = 0; // 错误时返回0
    }
};

// 批量获取当前页数据的持有人数量
const fetchCurrentPageHolders = () => {
    const currentItems = paginatedHistoryData.value;
    currentItems.forEach(item => {
        fetchHolderCount(item.state.mint);
    });
};

// 页码变化处理
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
    // 页码变化后，重新获取当前页的持有人数据
    fetchCurrentPageHolders();
};

const toFexedStake = (num, decimals) => {
    if (num == null || decimals == null) {
        console.error('Number and decimals must be provided.');
        return 0;
    }
    const divisor = Math.pow(10, JSON.parse(decimals));

    return (JSON.parse(num) / divisor).toFixed(2);;

};

// 图片加载错误处理
const handleImageError = (item) => {
    item.imageUrl = defaultImage;
};

// 格式化数字（千分位）
const come = (num) => {
    if (num === undefined || num === null) return '0';
    const reg = num.toString().indexOf(".") > -1
        ? /(\d)(?=(\d{3})+\.)/g
        : /(\d)(?=(\d{3})+$)/g;
    return num.toString().replace(reg, "$1,");
};

// 初始化数据加载
watchEffect(async () => {
    try {
        loading.value = false; // 开始加载
        const res = await tokenList();
        console.log("原始tokenList数据:", res);

        if (!res.error) {
            const tokenList = [];
            // 解析数据，提取需要的字段
            res.forEach(item => {
                const parsedInfo = item.account.data.parsed?.info;
                if (parsedInfo?.extensions) {
                    // 查找包含tokenMetadata的扩展
                    const metadataExt = parsedInfo.extensions.find(
                        ext => ext.extension === 'tokenMetadata'
                    );
                    if (metadataExt?.state) {
                        // 组装完整数据（补充imageUrl字段）
                        tokenList.push({
                            ...parsedInfo,
                            state: metadataExt.state,
                            imageUrl: metadataExt.state.uri || defaultImage // 图片地址
                        });
                    }
                }
            });
            // 截取前100条数据
            historyData.value = tokenList.slice(0, 100);
            totalItems.value = historyData.value.length;
            // 加载当前页的持有人数据
            fetchCurrentPageHolders();
        }
    } catch (error) {
        console.error("数据加载失败:", error);
        historyData.value = [];
        totalItems.value = 0;
    } finally {
        loading.value = true; // 加载完成
    }
});

// 跳转到详情页
const pubbleys = (url) => {
    if (url) {
        router.push({
            name: "address",
            params: { url }
        });
    }
};

// 初始加载时触发一次当前页数据获取
fetchCurrentPageHolders();
</script>