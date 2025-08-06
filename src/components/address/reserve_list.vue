<template>
  <div>
    <div class="segment">
      <div class="segment-item">
        <div class="segment-first">{{ newSegment[0] }} —— {{ newSegment[newSegment.length - 1] }}</div>
        <div class="segment-second">
          <div><span class="Unlocked">Unlocked Reserve</span></div>
          <div><span class="Withdrawable">Withdrawable Reserve</span></div>
        </div>
      </div>
      <div class="segment-item">
        <div class="segment-third segment-price">{{ $t("not-been-released") }} <text>{{
          smartFormatNumber(amountReserve(historyData,
            false))
            }}</text> BTG </div>
        <div class="segment-fourth segment-price">{{ $t("have-been-released") }} <text> {{
          smartFormatNumber(amountReserve(historyData,
            true)) }}</text> BTG </div>
      </div>
    </div>
    <!-- <div v-if="!reserveType" class="releasedBox">
      <div class="releasedChild">
        {{ $t("not-been-released") }}
        <p class="releasedAmount">{{ smartFormatNumber(amountReserve(historyData, false)) }} BTG</p>
      </div>
      <div class="releasedChild">
        {{ $t("have-been-released") }}
        <p class="releasedAmount">
          {{ smartFormatNumber(amountReserve(historyData, true)) }} BTG
        </p>
      </div>
    </div> -->
    <!-- <div style="width: 96%; margin: auto; display: flex; justify-content: end;">
      <div class="menu-item dropdown dropdown-mobile-full">
        <a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link scales"
          style="white-space: nowrap;text-decoration: none;color: #fff;">
          {{ nameText }}
          <i class="bi bi-chevron-down" style="margin: 5px;"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
          <div class="dropdown-item align-items-center" :class="item.type ? 'text-theme' : ''"
            style="cursor: pointer;text-align: center;" v-for="(item, index) in selectData" :key="index"
            @click="selsetClick(index)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div> -->
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
        <template v-if="historyData.length != 0 && type">
          <tr v-for="(item, index) in paginatedHistoryData" :key="index" style="cursor: pointer"
            @click="detailsFunction(item.child)">
            <td>{{ formatTimestamp(item.startTime) }}</td>
            <td>{{ formatTimestamp(item.endTime) }}</td>
            <td>{{ item.futureCount + ' / ' + item.child.length }}</td>
            <td>{{ come(smartFormatNumber(toFexedStake(item.amount))) }}</td>
            <td class="text-theme" v-if="reserveType">
              <RenderText v-if="item.child[0].mint" :address="item.child[0].mint" />
            </td>
            <td class="text-theme" v-else>
              <RenderText v-if="item.child[0].owner" :address="item.child[0].owner" />

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
      <el-pagination background layout="prev, pager, next" :hide-on-single-page="true" :current-page="currentPage"
        :page-size="pageSize" :total="totalItems" @current-change="handlePageChange" />
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
  nextTick
} from 'vue';
import TimeData from "./timeData.vue"
import * as echarts from 'echarts';
import moment from 'moment';
import { useRouter } from 'vue-router';
import { toggleView, currentView, newSegment, dateRange } from "./calculation.js"

import { useAppVariableStore } from '@/stores/app-variable';

import LoadingVue from '../../components/block/loading.vue';
import { smartFormatNumber } from '../../components/number/smart';
import { chainRequest } from '../../request/chain';
// import { order } from '../../request/order';
import { decodeLockAccount } from '../../request/record';
// import { parseNFTMetadata } from '../../request/reserve';
// import { setData } from '../../views/Search/adress/components/event-bus';
// import { proportionAmount } from '../method/proportion_account';
import { titleUrl } from '../method/title_url';
import RenderText from "../Render/text.vue"

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
const selectAddress = ref('One month'); // 初始值设为value
const weekArray = ref([]);
const chartInstance = ref(null); // 保存ECharts实例

const mouthReleased = ref(Array(Object.keys(newSegment.value).length).fill(0));
const mouthUnreleased = ref(Array(Object.keys(newSegment.value).length).fill(0));
const paginatedHistoryData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return historyData.value.slice(start, end);
});
const router = useRouter();
const totalItems = ref(0);
const nameText = ref("One month");


const selectData = ref([
  { name: 'One Month', value: '30' },
  { name: 'One Year', value: '365' },
])

// const selsetClick = (index) => {
//   nameText.value = selectData.value[index].name;
//   updateDateRange(selectData.value[index].value)
// }

const type = ref(true);
const handlePageChange = (newPage) => {
  type.value = false;
  currentPage.value = newPage;
  setTimeout(() => {
    type.value = true;
  }, 1);
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
  processData()
  loading.value = false;

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


  // releasedArray.value = mergedReleasedArray;
  // unreleasedArray.value = unmergedReleasedArray;
  // echartReleased.value = amountFunction(mergedReleasedArray, true);
  // echartReleased.value = amountFunction(unmergedReleasedArray, true);
  // echartUnreleased.value = amountFunction(unmergedReleasedArray, false);

  return Object.values(grouped);
};

const detailsFunction = (data) => {
  sessionStorage.setItem('details', JSON.stringify(data));

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
  updateChart();
};

const updateChart = () => {
  if (!chartInstance.value) return;

  chartInstance.value.setOption({
    title: { show: false },
    tooltip: {},
    xAxis: {
      axisTick: {
        alignWithLabel: true
      },
      data: newSegment.value
    },
    yAxis: {
      show: true,
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)' // 网格线颜色（例如淡灰色半透明）
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.8)' // Y轴线颜色（例如淡灰色半透明）
        }
      }
    },
    series: [
      {
        name: 'reserve',
        type: 'bar',
        // data: [13, 23, 4, 5, 2, 2, 4, 2, 41, 4, 52, 45],
        data: echartReleased.value,
        color: `rgba(0, 255, 179, 1)`
        // color: `rgba(${appVariable.color.themeRgb}, 0.4)`
      },
      {
        name: 'redemption',
        type: 'bar',
        data: echartUnreleased.value,
        // data: [13, 4, 5, 62, 3, 5, 1, 3, 5, 6, 5, 35, 6],
        color: 'rgba(34, 156, 242, 1)'
        // color: `rgba(${appVariable.color.themeRgb}, 0.8)`
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

// 父组件调用
const handleSelect = async (index) => {
  toggleView(index);
  await nextTick();
  updateDateRange(newSegment.value)
  mouthReleased.value = Array(Object.keys(newSegment.value).length).fill(0);
  mouthUnreleased.value = Array(Object.keys(newSegment.value).length).fill(0);
  DataProcessing(index)
  // 更新视图
  // 子组件的业务逻辑（例如刷新数据、处理筛选等）
};
defineExpose({
  handleSelect // 将需要被调用的方法暴露出去
});

// 数据处理

const DataProcessing = (newSegment) => {
  let array = [];
  for (let i in historyData.value) {
    for (let j in historyData.value[i].child) {
      array.push(historyData.value[i].child[j]);
    }
  }
  if (newSegment == 'month') {
    processData()

  } else {
    MonthprocessData()
  }
};

function formatTimeToDay(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  const month = months[date.getMonth()];
  const day = date.getDate();

  // 获取序数词后缀
  let suffix;
  if (day >= 11 && day <= 13) {
    suffix = 'th';
  } else {
    switch (day % 10) {
      case 1: suffix = 'st'; break;
      case 2: suffix = 'nd'; break;
      case 3: suffix = 'rd'; break;
      default: suffix = 'th';
    }
  }

  return `${month} ${day}${suffix}`;
}

function processData() {
  // 重置数组
  mouthReleased.value = Array.from({ length: newSegment.value.length }, () => 0);
  mouthUnreleased.value = Array.from({ length: newSegment.value.length }, () => 0);

  historyData.value.forEach(item => {
    const amount = Number(item.amount) || 0;

    // 处理startTime
    const startDateStr = formatTimeToDay(item.startTime);
    const startIndex = newSegment.value.findIndex(day => day === startDateStr);
    if (startIndex !== -1) {
      mouthReleased.value[startIndex] += amount / 1000000000;
    }

    // 处理endTime
    const endDateStr = formatTimeToDay(item.endTime);
    const endIndex = newSegment.value.findIndex(day => day === endDateStr);
    if (endIndex !== -1) {
      mouthUnreleased.value[endIndex] += amount / 1000000000;
    }
  });
  echartReleased.value = mouthReleased.value;
  echartUnreleased.value = mouthUnreleased.value;
  updateDateRange(newSegment.value)

}

// 月份时间处理

function formatTimeToMonth(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
    'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  const month = months[date.getMonth()]; // 获取月份缩写
  const year = date.getFullYear(); // 获取四位年份

  return `${month} ${year}`;
}

function MonthprocessData() {
  // 重置数组（避免重复累加）
  mouthReleased.value = Array.from({ length: newSegment.value.length }, () => 0);
  mouthUnreleased.value = Array.from({ length: newSegment.value.length }, () => 0);

  historyData.value.forEach(item => {
    const amount = Number(item.amount) || 0; // 转换金额为数字

    // 处理startTime：匹配月份数组，累加至echartReleased
    const startMonthStr = formatTimeToMonth(item.startTime);
    const startIndex = newSegment.value.findIndex(month => month === startMonthStr);
    if (startIndex !== -1) { // 找到匹配的月份
      mouthReleased.value[startIndex] += amount / 1000000000;
    }

    // 处理endTime：匹配月份数组，累加至mouthUnreleased
    const endMonthStr = formatTimeToMonth(item.endTime);
    const endIndex = newSegment.value.findIndex(month => month === endMonthStr);
    if (endIndex !== -1) { // 找到匹配的月份
      mouthUnreleased.value[endIndex] += amount / 1000000000;
    }
  });
  echartReleased.value = mouthReleased.value;
  echartUnreleased.value = mouthUnreleased.value;
  updateDateRange(newSegment.value)

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
  width: 100%;
  margin: auto;
  /* padding: 4rem 2rem; */
}

.releasedChild {
  font-weight: bold;
}

.segment {
  color: #fff;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 3%;
}

.segment-first {
  font-size: 24px;
  font-weight: 500;
}

.segment-second {
  font-size: 14px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
}

.segment-price {
  font-size: 18px;
  font-weight: 500;
}

.segment-third {}

.segment-third text {
  color: #4C9AEB;
}

.segment-fourth {}

.segment-fourth text {
  color: rgba(0, 255, 179, 1);
}

.Unlocked {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.Unlocked::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #28a745;
  margin-right: 6px;
  vertical-align: middle;
}

.Withdrawable {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.Withdrawable::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
  background: rgba(34, 156, 242, 1);
}
</style>