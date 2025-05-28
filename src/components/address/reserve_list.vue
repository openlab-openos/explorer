<template>
  <div>
    <div v-if="!reserveType" class="releasedBox">
      <div class="releasedChild">
        <h3>{{ $t("not-been-released") }}</h3>
        <h4>
          <p class="releasedAmount">{{ smartFormatNumber(amountReserve(historyData, false)) }} BTG</p>
        </h4>
      </div>
      <div class="releasedChild">
        <h3>{{ $t("have-been-released") }}</h3>
        <h4>
          <p class="releasedAmount">
            {{ smartFormatNumber(amountReserve(historyData, true)) }} BTG
          </p>
        </h4>
      </div>
    </div>
    <div style="width: 96%; margin: auto; display: flex; justify-content: end;">
      <el-select v-model="selectAddress" placeholder="Select" style="width: 115px">
        <el-option label="7 Days" value="7" />
        <el-option label="30 Days" value="30" />
      </el-select>
    </div>
    <div class="EChartsBox">
      <div id="main" style="width: 100%; height: 300px;"></div>
    </div>
    <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small" v-if="!loading">
      <tbody>
        <tr>
          <th>{{ $t("stakeTime") }}</th>
          <th>{{ $t("last_time") }}</th>
          <th>{{ $t("stage") }}</th>
          <th>{{ $t("account.destination") }}</th>
          <th v-if="reserveType">{{ $t("mint") }}</th>
          <th v-else>{{ $t("account.Owner") }}</th>
        </tr>
        <template v-if="historyData.length != 0">
          <tr v-for="(item, index) in paginatedHistoryData" :key="index" style="cursor: pointer" @click="detailsFunction(item.child)">
            <td>{{ formatTimestamp(item.startTime) }}</td>
            <td>{{ formatTimestamp(item.endTime) }}</td>
            <td>{{ item.futureCount + ' / ' + item.child.length }}</td>
            <td>{{ come(smartFormatNumber(toFexedStake(item.amount))) }}</td>
            <td class="text-theme" v-if="reserveType">
              {{ titleUrl(item.child[0].mint).type ? titleUrl(item.child[0].mint).url : stringcate(item.child[0].mint) }}
              <img v-if="titleUrl(item.child[0].mint).type" v-for="(imgItem, index) in titleUrl(item.child[0].mint).certificates" :src="imgItem.img" :key="index" width="24" alt="" class="marginRight10">
            </td>
            <td class="text-theme" v-else>
              {{ titleUrl(item.child[0].owner).type ? titleUrl(item.child[0].owner).url : stringcate(item.child[0].owner) }}
              <img v-if="titleUrl(item.child[0].owner).type" v-for="(imgItem, index) in titleUrl(item.child[0].owner).certificates" :src="imgItem.img" :key="index" width="24" alt="" class="marginRight10">
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-if="loading" class="text-center">
      <loading-vue />
    </div>
    <div v-if="historyData.length == 0 && !loading" class="text-center">
      {{ $t("account.available") }}
    </div>
    <div class="justify-end padding-10" v-if="historyData.length != 0">
      <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage" :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import * as echarts from 'echarts';
import moment from 'moment';

import { useAppVariableStore } from '@/stores/app-variable';

import LoadingVue from '../../components/block/loading.vue';
import { smartFormatNumber } from '../../components/number/smart';
import { chainRequest } from '../../request/chain';
import { order } from '../../request/order';
import { decodeLockAccount } from '../../request/record';
import { parseNFTMetadata } from '../../request/reserve';
import { setData } from '../../views/Search/adress/components/event-bus';
import { proportionAmount } from '../method/proportion_account';
import { titleUrl } from '../method/title_url';

const props = defineProps({
  url: { type: String, default: '' },
  paramsId: { type: String, default: '' },
  type: { type: Boolean, default: false }
});

const loading = ref(true);
const appVariable = useAppVariableStore();
const historyData = ref([]);
const currentPage = ref(1);
const pageSize = ref(25);
const url = ref(props.url);
const paramsId = ref(props.paramsId);
const reserveType = ref(props.type);
const releasedArray = ref([]);
const unreleasedArray = ref([]);

const echartReleased = ref([]);
const echartUnreleased = ref([]);
const selectAddress = ref('7'); // 初始值设为value
const weekArray = ref([]);
const chartInstance = ref(null); // 保存ECharts实例

const paginatedHistoryData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return historyData.value.slice(start, end);
});

const totalItems = ref(0);

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const requestList = async (object) => {
  try {
    const response = await chainRequest(object);
    return response.result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

onMounted(async () => {
  setTimeout(() => {
    loading.value = false;
  }, 3000);
  
  let data;
  data = await requestList({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getProgramAccounts",
    "params": [
      "vrccD48wXDoZbj9t6xu7X2362Lr9yyocMB7aq9GVaym",
      {
        "filters": [
          {
            "memcmp": {
              "offset": 8,
              "bytes": url.value
            }
          }
        ]
      }
    ]
  });

  for (let i = 0; i < data.length; i++) {
    data[i].metadata = decodeLockAccount(data[i].account.data);
  }
  
  historyData.value = groupBySerialNumber(data);
  initChart();
  totalItems.value = historyData.value.length;
});

const groupBySerialNumber = (arr) => {
  const grouped = {};
  const currentTime = Math.floor(Date.now() / 1000);
  
  arr.forEach(item => {
    const key = item.metadata.serialNumber;
    if (!grouped[key]) {
      grouped[key] = {
        serial: key,
        startTime: item.metadata.startTime,
        endTime: item.metadata.endTime,
        child: [],
        amount: 0,
        futureCount: 0,
        released: 0,
        unreleased: 0,
        releasedArray: [],
        unreleasedArray: []
      };
    }
    
    grouped[key].child.push(item.metadata);
    grouped[key].amount += parseFloat(item.metadata.amount) || 0;
    
    if (parseInt(item.metadata.endTime) > currentTime) {
      grouped[key].released += parseFloat(item.metadata.amount) || 0;
      grouped[key].releasedArray.push({
        amount: item.metadata.amount,
        startTime: item.metadata.startTime,
        endTime: item.metadata.endTime,
        startDay: timeSome(item.metadata.startTime),
        endDay: timeSome(item.metadata.endTime)
      });
      grouped[key].unreleasedArray.push({
        amount: 0,
        startTime: item.metadata.startTime,
        endTime: item.metadata.endTime,
        startDay: timeSome(item.metadata.startTime),
        endDay: timeSome(item.metadata.endTime)
      });
    } else {
      grouped[key].futureCount++;
      grouped[key].releasedArray.push({
        amount: 0,
        startTime: item.metadata.startTime,
        endTime: item.metadata.endTime,
        startDay: timeSome(item.metadata.startTime),
        endDay: timeSome(item.metadata.startTime)
      });
      grouped[key].unreleasedArray.push({
        amount: item.metadata.amount,
        startTime: item.metadata.startTime,
        endTime: item.metadata.endTime,
        startDay: timeSome(item.metadata.startTime),
        endDay: timeSome(item.metadata.endTime)
      });
      
      if (!item.metadata.isUnlocked) {
        grouped[key].unreleased += parseFloat(item.metadata.amount) || 0;
      }
    }
  });
  
  const mergedReleasedArray = [];
  const unmergedReleasedArray = [];
  Object.values(grouped).forEach(group => {
    mergedReleasedArray.push(...group.releasedArray);
    unmergedReleasedArray.push(...group.unreleasedArray);
  });
  
  releasedArray.value = mergedReleasedArray;
  unreleasedArray.value = unmergedReleasedArray;
  echartReleased.value = amountFunction(mergedReleasedArray, true);
  echartUnreleased.value = amountFunction(unmergedReleasedArray, false);
  
  return Object.values(grouped);
};

const detailsFunction = (data) => {
  sessionStorage.setItem('details', JSON.stringify(data));
  const router = useRouter();
  router.push({ name: 'details' });
};

const come = (num) => {
  let reg = num.toString().indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;
  return num.toString().replace(reg, '$1,');
};

const timeSome = (time) => {
  return time ? moment(time * 1000).format('YYYY-MM-DD') : '';
};

const toFexedStake = (num) => {
  if (num) {
    return (num / 1000000000) > 1 ? (num / 1000000000).toFixed(2) : num / 1000000000;
  }
  return 0;
};

const stampSome = (time) => {
  return moment(time * 1000).fromNow();
};

function formatTimestamp(timestamp) {
  return moment(timestamp * 1000).format('YYYY-M-DD hh:mm:ss');
}

const percent = (lod, nem) => {
  if (nem === 0) return 0;
  return (lod / nem * 100).toFixed(5);
};

const pubbtx = (url) => {
  const router = useRouter();
  router.push({ name: 'address', params: { url } });
};

const transaction = (item) => {
  const router = useRouter();
  router.push({ name: 'tx', params: { item } });
};

const stringcate = (str) => {
  if (str.length < 10) return str;
  return str.slice(0, 8) + '...' + str.slice(-8);
};

const amountReserve = (item, boolean) => {
  if (boolean) {
    let amount = 0;
    for (let i in item) {
      amount += item[i].unreleased;
    }
    let num = (amount / 1000000000) > 1 ? (amount / 1000000000).toFixed(2) : amount / 1000000000;
    let reg = num.toString().indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;
    return num.toString().replace(reg, '$1,');
  } else {
    let amount = 0;
    for (let i in item) {
      amount += item[i].released;
    }
    let num = (amount / 1000000000) > 1 ? (amount / 1000000000).toFixed(2) : amount / 1000000000;
    let reg = num.toString().indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g;
    return num.toString().replace(reg, '$1,');
  }
};

// 图表相关函数
const initChart = () => {
  const chartDom = document.getElementById('main');
  if (!chartDom) return;
  
  // 销毁旧实例
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  
  // 初始化新实例
  chartInstance.value = echarts.init(chartDom, null, { height: 300 });
  updateDateRange(selectAddress.value);
  
  // 监听选择变化
  watch(
    selectAddress,
    (newValue) => {
      updateDateRange(newValue);
    },
    { immediate: true }
  );
};

const updateDateRange = (value) => {
  let startOffset, endOffset;
  if (value === '30') {
    startOffset = -10;
    endOffset = 19;
  } else {
    startOffset = -2;
    endOffset = 4;
  }
  
  weekArray.value = getWeekDates(startOffset, endOffset);
  echartReleased.value = amountFunction(releasedArray.value, true);
  echartUnreleased.value = amountFunction(unreleasedArray.value, false);
  updateChart();
};

const updateChart = () => {
  if (!chartInstance.value) return;
  
  chartInstance.value.setOption({
    title: { show: false },
    tooltip: {},
    xAxis: { data: weekArray.value },
    yAxis: { show: false },
    series: [
      {
        name: 'reserve',
        type: 'bar',
        data: echartReleased.value,
        color: `rgba(${appVariable.color.themeRgb}, 0.4)`
      },
      {
        name: 'redemption',
        type: 'bar',
        data: echartUnreleased.value,
        color: `rgba(${appVariable.color.themeRgb}, 0.8)`
      }
    ]
  });
};

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekDates(index, indext) {
  const dates = [];
  const today = new Date();
  for (let i = index; i <= indext; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(formatDate(date));
  }
  return dates;
}

const amountFunction = (data, boolean) => {
  const weeklyAmounts = new Map();
  weekArray.value.forEach(day => weeklyAmounts.set(day, 0));
  
  data.forEach(item => {
    const dateKey = boolean ? 'startDay' : 'endDay';
    const targetDay = item[dateKey];
    const amount = parseFloat(item.amount) || 0;
    
    if (weeklyAmounts.has(targetDay)) {
      const currentAmount = weeklyAmounts.get(targetDay);
      weeklyAmounts.set(targetDay, currentAmount + amount);
    }
  });
  
  return Array.from(weeklyAmounts.values());
}
</script>

<style scoped>
.releasedBox {
    width: 90%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
}

.EChartsBox {
    width: 90%;
    margin: auto;
    padding: 4rem 2rem;
}
</style>