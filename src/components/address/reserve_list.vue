<template>
  <div>
    <div class="segment">
      <div class="segment-item">
        <div class="segment-first">{{ newSegmented[0] }} —— {{ newSegmented[newSegmented.length - 1] }}</div>
        <div class="segment-second">
          <div><span class="Unlocked">{{ $t("account.Unlocked") }}</span></div>
          <div><span class="Withdrawable">{{ $t("account.Locked") }}</span></div>
        </div>
      </div>
      <div class="segment-item">
        <div class="segment-third segment-price">{{ $t("not-been-released") }} <text>{{
          smartFormatNumber(amountReserve(historyData,
            false))
            }}</text> BTG </div>
        <!-- <div class="segment-fourth segment-price">{{ $t("have-been-released") }} <text> {{
          smartFormatNumber(amountReserve(historyData,
            true)) }}</text> BTG </div> -->
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
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import dayjs from 'dayjs';
// import TimeData from "./timeData.vue"
import * as echarts from 'echarts';
import moment from 'moment';
import { useRouter } from 'vue-router';

import { useAppVariableStore } from '@/stores/app-variable';
import i18n from '@/i18n';
import LoadingVue from '../../components/block/loading.vue';
import { smartFormatNumber } from '../../components/number/smart';
import { chainRequest } from '../../request/chain';
// import { order } from '../../request/order';
import { decodeLockAccount } from '../../request/record';
// import { parseNFTMetadata } from '../../request/reserve';
// import { setData } from '../../views/Search/adress/components/event-bus';
// import { proportionAmount } from '../method/proportion_account';
import { titleUrl } from '../method/title_url';
import RenderText from '../Render/text.vue';
import {
  currentView,
  dateRange,
  newSegment,
  toggleView,
  newSegmented
} from './calculation.js';
// console.log(newSegmented.value);

const props = defineProps({
  url: { type: String, default: '' },
  paramsId: { type: String, default: '' },
  type: { type: Boolean, default: false }
});

const loading = ref(true);
const appVariable = useAppVariableStore();
const historyData = ref([]);
const allChildren = ref([]);
const currentPage = ref(1);
const pageSize = ref(25);
const url = ref(props.url);
const paramsId = ref(props.paramsId);
const reserveType = ref(props.type);
const releasedArray = ref([]);
const unreleasedArray = ref([]);
const dataList = ref([]);

const echartReleased = ref([]);
const echartUnreleased = ref([]);
const selectAddress = ref('Per Month'); // 初始值设为value
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
const nameText = ref("Per Month");

// const { t } = useI18n()
const selectData = ref([
  { name: 'Per Month', value: '30' },
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
  historyData.value = historyData.value.sort((a, b) => {
    return b.startTime - a.startTime;
  })
  initChart();
  totalItems.value = historyData.value.length;
  allChildren.value = historyData.value?.flatMap(group => group.child) || [];
  // console.log(allChildren.value);

  processData()
  loading.value = false;

});

// const groupBySerialNumber = (arr) => {
//   const grouped = {};
//   const currentTime = Math.floor(Date.now() / 1000);


//   arr.forEach(item => {
//     console.log(item);
//     const key = item.metadata.serialNumber;
//     if (!grouped[key]) {
//       grouped[key] = {
//         serial: key,
//         startTime: item.metadata.startTime,
//         endTime: item.metadata.endTime,
//         child: [],
//         amount: 0,
//         futureCount: 0,
//         released: 0,
//         unreleased: 0,
//         releasedArray: [],
//         unreleasedArray: []
//       };
//     }

//     grouped[key].child.push(item.metadata);
//     grouped[key].amount += parseFloat(item.metadata.amount) || 0;

//     if (parseInt(item.metadata.endTime) > currentTime) {
//       grouped[key].released += parseFloat(item.metadata.amount) || 0;
//       grouped[key].releasedArray.push({
//         amount: item.metadata.amount,
//         startTime: item.metadata.startTime,
//         endTime: item.metadata.endTime,
//         startDay: timeSome(item.metadata.startTime),
//         endDay: timeSome(item.metadata.endTime)
//       });
//       grouped[key].unreleasedArray.push({
//         amount: 0,
//         startTime: item.metadata.startTime,
//         endTime: item.metadata.endTime,
//         startDay: timeSome(item.metadata.startTime),
//         endDay: timeSome(item.metadata.endTime)
//       });
//     } else {
//       grouped[key].futureCount++;
//       grouped[key].releasedArray.push({
//         amount: 0,
//         startTime: item.metadata.startTime,
//         endTime: item.metadata.endTime,
//         startDay: timeSome(item.metadata.startTime),
//         endDay: timeSome(item.metadata.startTime)
//       });
//       grouped[key].unreleasedArray.push({
//         amount: item.metadata.amount,
//         startTime: item.metadata.startTime,
//         endTime: item.metadata.endTime,
//         startDay: timeSome(item.metadata.startTime),
//         endDay: timeSome(item.metadata.endTime)
//       });

//       if (!item.metadata.isUnlocked) {
//         grouped[key].unreleased += parseFloat(item.metadata.amount) || 0;
//       }
//     }
//   });

//   const mergedReleasedArray = [];
//   const unmergedReleasedArray = [];
//   Object.values(grouped).forEach(group => {
//     mergedReleasedArray.push(...group.releasedArray);
//     unmergedReleasedArray.push(...group.unreleasedArray);
//   });

//   return Object.values(grouped);
// };

const groupBySerialNumber = (arr) => {
  const grouped = {};
  const currentTime = Math.floor(Date.now() / 1000);

  arr.forEach(item => {
    const key = item.metadata.serialNumber;
    // 解析当前 item 的开始/结束时间（转为数字便于比较）
    const itemStartTime = parseInt(item.metadata.startTime);
    const itemEndTime = parseInt(item.metadata.endTime);

    if (!grouped[key]) {
      // 初始化分组时，用当前 item 的时间作为初始值
      grouped[key] = {
        serial: key,
        startTime: itemStartTime, // 初始为当前 item 的开始时间
        endTime: itemEndTime,     // 初始为当前 item 的结束时间
        child: [],
        amount: 0,
        futureCount: 0,
        released: 0,
        unreleased: 0,
        releasedArray: [],
        unreleasedArray: []
      };
    } else {
      // 若分组已存在，更新结束时间为「当前分组结束时间」和「当前 item 结束时间」中的最大值
      grouped[key].endTime = Math.max(grouped[key].endTime, itemEndTime);
      // 可选：如果需要开始时间为最早时间，也可以类似处理
      grouped[key].startTime = Math.min(grouped[key].startTime, itemStartTime);
    }

    // 以下是原有逻辑（保持不变）
    grouped[key].child.push(item.metadata);
    grouped[key].amount += parseFloat(item.metadata.amount) || 0;

    if (itemEndTime > currentTime) {
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
const endPercent = ref((6 / newSegment.value.length) * 100);
const updateChart = () => {
  if (!chartInstance.value) return;
  const t = i18n.global.t;
  chartInstance.value.setOption({
    title: { show: false },
    tooltip: {
      trigger: 'item',
      // confine: true,
      backgroundColor: "rgba(52, 67, 79, 0.8)",
      formatter: function (params) {
        return `<div style="color: white;padding: 5px; " >  
           <div style="padding-bottom:12px" ><span class="Unlocked">  ${t(params.seriesName)} </span></div>
          <div> ${params.name}&nbsp;<text style="color:${params.color} " >${params.value}</text> BTG</div>
          </div>`;
      },
    },
    grid: {
      tooltip: {
        borderColor: "rgba(51, 51, 51, 0)"
      }
    },
    xAxis: {
      axisTick: {
        alignWithLabel: true,
      },
      data: newSegment.value,
      axisLabel: {
        // interval: 0,
        lineStyle: {
          // color: 'rgba(255, 255, 255, 0.8)' // X轴标签颜色（例如白色半透明）
        },
      },
      axisLine: {
        lineStyle: {
          color: function (params) {
            if (dayjs().format('MMM. Do') == params) {
              return 'rgba(255, 183, 0, 1)';
            }
            if (dayjs().format('MMM. YYYY') == params) {
              return 'rgba(255, 183, 0, 1)';
            }
            return 'rgba(255, 255, 255, 0.4)';
          }
        }
      },

    },
    yAxis: {
      name: '(BTG)',
      show: true,
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)' // 网格线颜色（例如淡灰色半透明）
          // color: 'rgba(255, 255, 255, 0.2)' // 网格线颜色（例如淡灰色半透明）
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.8)' // Y轴线颜色（例如淡灰色半透明）
        }
      },
      axisLabel: {
        formatter: function (value) {
          return value + ' ' + 'BTG';
        },
      }
    },
    series: [
      {
        name: 'account.Locked',
        type: 'bar',
        data: echartUnreleased.value,
        // data: [13, 4, 5, 62, 3, 5, 1, 3, 5, 6, 5, 35, 6],
        // color: 'rgba(34, 156, 242, 1)',
        color: `rgba(0, 255, 179, 1)`,
        itemStyle: {
          normal: {
            barBorderRadius: [8, 8, 0, 0]
          }
        }
        // color: `rgba(${appVariable.color.themeRgb}, 0.8)`
      },
      {
        name: 'account.Unlocked',
        type: 'bar',
        // data: [13, 23, 4, 5, 2, 2, 4, 2, 41, 4, 52, 45],
        data: echartReleased.value,
        color: 'rgba(34, 156, 242, 1)',
        itemStyle: {
          normal: {
            barBorderRadius: [8, 8, 0, 0],
          }
        }
        // color: `rgba(${appVariable.color.themeRgb}, 0.4)`
      },

    ]
  });
};

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

onMounted(async () => {
  toggleView('month');
  await nextTick();
  updateDateRange(newSegment.value)
  endPercent.value = (6 / newSegment.value.length) * 100;
  mouthReleased.value = Array(Object.keys(newSegment.value).length).fill(0);
  mouthUnreleased.value = Array(Object.keys(newSegment.value).length).fill(0);
  DataProcessing('month')
});

// 父组件调用
const handleSelect = async (index) => {
  toggleView(index);
  await nextTick();
  updateDateRange(newSegment.value)
  endPercent.value = (6 / newSegment.value.length) * 100;
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
  // console.log(newSegmented.value);

  if (newSegment == 'month') {
    processData()
  }
  if (newSegment == 'year') {
    MonthprocessData()
  }
  if (newSegment == 'all') {
    AllprocessData()
  }

  // 新增处理 newSegment == 'all' 的逻辑
  // if (newSegment == 'all') {
  //   if (allChildren.value.length === 0) {
  //     return;
  //   }
  //   // 获取第一条数据的开始时间和最后一条数据的结束时间
  //   const firstItem = allChildren.value[0];
  //   const lastItem = allChildren.value[allChildren.value.length - 1];
  //   const firstStartTime = Number(firstItem.startTime);
  //   const lastEndTime = Number(lastItem.endTime);

  //   // 转换为月份数
  //   const firstStartMonth = new Date(firstStartTime * 1000).getMonth();
  //   const lastEndMonth = new Date(lastEndTime * 1000).getMonth();
  //   const currentMonth = new Date().getMonth();

  //   // 计算间隔月份
  //   const monthDiff = Math.abs(lastEndMonth - firstStartMonth);

  //   // 判断是否为本月的前8个月或后4个月
  //   const isWithinRange = (
  //     (firstStartMonth <= currentMonth && firstStartMonth >= currentMonth - 8) ||
  //     (lastEndMonth >= currentMonth && lastEndMonth <= currentMonth + 4)
  //   );

  //   if (isWithinRange || monthDiff <= 12) {
  //     // 如果在范围内或间隔小于等于12个月，使用MonthprocessData
  //     MonthprocessData();
  //   } else {
  //     // 否则，以开始时间月份为始，结束时间月份为尾绘制表格
  //     CustomMonthRangeProcess(firstStartTime, lastEndTime);
  //   }
  // }
};


// 新增按年处理数据函数
function AllprocessData() {
  // 重置数据数组
  mouthReleased.value = [];
  mouthUnreleased.value = [];

  // 获取年份列表（从newSegment.value中提取，因为在all视图下它包含年份）
  const years = newSegment.value;

  // 初始化数据数组
  mouthReleased.value = Array(years.length).fill(0);
  mouthUnreleased.value = Array(years.length).fill(0);

  // 处理数据
  allChildren.value.forEach(item => {
    const amount = Number(item.amount) || 0;

    // 处理startTime - 按年份
    const startYear = new Date(Number(item.startTime) * 1000).getFullYear();
    const startIndex = years.findIndex(year => Number(year) === startYear);
    if (startIndex !== -1) {
      mouthReleased.value[startIndex] += amount / 1000000000;
    }

    // 处理endTime - 按年份
    const endYear = new Date(Number(item.endTime) * 1000).getFullYear();
    const endIndex = years.findIndex(year => Number(year) === endYear);
    if (endIndex !== -1) {
      mouthUnreleased.value[endIndex] += amount / 1000000000;
    }
  });

  // 更新图表数据
  echartReleased.value = mouthReleased.value;
  echartUnreleased.value = mouthUnreleased.value;

  // 更新日期范围
  updateDateRange(newSegment.value);
}

// 添加格式化时间为年份的函数
function formatTimeToYear(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  return date.getFullYear().toString();
}


// // 添加自定义月份范围处理函数
// function CustomMonthRangeProcess(startTime, endTime) {
//   // 重置数组
//   mouthReleased.value = [];
//   mouthUnreleased.value = [];

//   // 获取开始和结束的月份范围
//   const startDate = new Date(startTime * 1000);
//   const endDate = new Date(endTime * 1000);

//   // 生成开始月份到结束月份的所有月份
//   const months = [];
//   let currentDate = new Date(startDate);
//   currentDate.setDate(1); // 确保从月份第一天开始

//   while (currentDate <= endDate) {
//     const monthStr = formatTimeToMonth(currentDate.getTime() / 1000);
//     months.push(monthStr);
//     currentDate.setMonth(currentDate.getMonth() + 1);
//   }

//   // 更新newSegment.value为自定义范围
//   newSegment.value = months;

//   // 重置数据数组
//   mouthReleased.value = Array(months.length).fill(0);
//   mouthUnreleased.value = Array(months.length).fill(0);

//   // 处理数据
//   allChildren.value.forEach(item => {
//     const amount = Number(item.amount) || 0;

//     // 处理startTime
//     const startMonthStr = formatTimeToMonth(item.startTime);
//     const startIndex = months.findIndex(month => month === startMonthStr);
//     if (startIndex !== -1) {
//       mouthReleased.value[startIndex] += amount / 1000000000;
//     }

//     // 处理endTime
//     const endMonthStr = formatTimeToMonth(item.endTime);
//     const endIndex = months.findIndex(month => month === endMonthStr);
//     if (endIndex !== -1) {
//       mouthUnreleased.value[endIndex] += amount / 1000000000;
//     }
//   });

//   echartReleased.value = mouthReleased.value;
//   echartUnreleased.value = mouthUnreleased.value;

//   updateDateRange(newSegment.value);
// }

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
  // console.log(mouthReleased.value);
  // console.log(mouthUnreleased.value);
  // console.log(allChildren.value);
  
  allChildren.value.forEach(item => {
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
  // console.log(newSegment.value);

  // console.log(mouthReleased.value);
  // console.log(mouthUnreleased.value);
  // console.log(allChildren.value);

  allChildren.value.forEach(item => {
    const amount = Number(item.amount) || 0; // 转换金额为数字

    // 处理startTime：匹配月份数组，累加至echartReleased
    const startMonthStr = formatTimeToMonth(item.startTime);
    // console.log(startMonthStr);
    
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
  // console.log(echartReleased.value);
  // console.log(echartUnreleased.value);

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
  padding: 0 5%;
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
  text-align: end;
}

.segment-price {
  font-size: 16px;
}


.segment-third text {
  color: #4C9AEB;
}

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
  background-color: rgba(0, 255, 179, 1);
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