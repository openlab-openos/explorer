<template>

    <div class="col-xl-3 minification">
        <!-- BEGIN card -->
        <card class="mb-3">
            <card-body>
                <h3> Details</h3>
                <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small"
                    v-if="!loading">
                    <tbody>
                        <tr>
                            <th>
                                {{ $t("stakeTime") }}
                            </th>
                            <th>
                                {{ $t("last_time") }}
                            </th>
                            <!-- <th>
                    {{ $t("account.owner") }}
                </th> -->
                            <!-- <th>
                    {{ $t("stage") }}
                </th> -->
                            <th>
                                {{ $t("account.destination") }}
                            </th>
                            <th>
                                {{ $t("mint") }}
                            </th>
                            <th>
                                {{ $t("account.Owner") }}
                            </th>
                            <th>
                                isUnlocked
                            </th>
                        </tr>
                        <template v-if="historyData.length != 0">
                            <tr v-for="(item, index) in paginatedHistoryData" :key="index"
                                @click="detailsFunction(item.child)">
                                <td>
                                    <!-- {{ item.startTime }} -->
                                    {{ formatTimestamp(item.startTime) }}
                                </td>
                                <td>
                                    <!-- {{ item.startTime }} -->
                                    {{ formatTimestamp(item.endTime) }}
                                </td>
                                <!-- <td>
                        {{ come(item.serial) }}
                    </td> -->
                                <!-- <td>
                        {{ item.futureCount + ' / ' + item.child.length }}
                    </td> -->
                                <td>
                                    {{ come(smartFormatNumber(toFexedStake(item.amount))) }}
                                </td>
                                <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.mint)">
                                    {{ titleUrl(item.mint).type ? titleUrl(item.mint).url :
                                        stringcate(item.mint) }}
                                    <img v-if="titleUrl(item.mint).type"
                                        v-for="item, index in titleUrl(item.mint).certificates" :src="item.img"
                                        :key="index" width="24" alt="" class="marginRight10">
                                </td>
                                <td class="text-theme" style="cursor: pointer" @click="pubbtx(item.owner)">
                                    {{ titleUrl(item.owner).type ? titleUrl(item.owner).url :
                                        stringcate(item.owner) }}
                                    <img v-if="titleUrl(item.owner).type"
                                        v-for="item, index in titleUrl(item.owner).certificates" :src="item.img"
                                        :key="index" width="24" alt="" class="marginRight10">
                                </td>
                                <td>
                                    {{ item.isUnlocked }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </card-body>
        </card>
        <!-- END card -->
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { getData, on } from './event-bus.js';
import moment from "moment";
import { useRouter } from "vue-router"
import {smartFormatNumber} from '../../../../components/number/smart.js'
import { titleUrl } from "../../../../components/method/title_url"
const router = useRouter();

const historyData = ref([]);
const proportion_amount = ref(0);
const currentPage = ref(1);
const pageSize = ref(25);
const detailsData = ref(null);

// 初始获取数据
onMounted(() => {
    detailsData.value = JSON.parse(sessionStorage.getItem('details'))

    // console.log(detailsData.value);
    historyData.value = detailsData.value;
    // console.log(historyData.value);

    if (!detailsData.value) {
        router.push({
            path: '/'
        })
    }
});

const totalItems = ref(0);

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return historyData.value.slice(start, end);
});

function formatTimestamp(timestamp) {
       return moment(timestamp*1000).format('YYYY-M-DD hh:mm:ss')
}
const toFexedStake = (num) => {
    if (num) {
        return (num / 1000000000);
    }
};
const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}
const stringcate = (str) => {
    if (str.length < 10) {
        return str;
    } else {
        return str.slice(0, 8) + "..." + str.slice(-8);
    }
};
const pubbtx = (url) => {
    router.push({
        name: "address",
        params: {
            url: url,
        },
    })
}
</script>