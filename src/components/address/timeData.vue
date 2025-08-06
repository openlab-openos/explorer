<template>
  <div class="daily-time-processor">
    <p>时间数组长度: {{ timeArray.length }}</p>
    <p>echartReleased: {{ echartReleased }}</p>
    <p>echartUnreleased: {{ echartUnreleased }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 时间数组（天级）
const timeArray = [
  'Jul. 17th', 'Jul. 18th', 'Jul. 19th', 'Jul. 20th', 'Jul. 21st', 
  'Jul. 22nd', 'Jul. 23rd', 'Jul. 24th', 'Jul. 25th', 'Jul. 26th', 
  'Jul. 27th', 'Jul. 28th', 'Jul. 29th', 'Jul. 30th', 'Jul. 31st', 
  'Aug. 1st', 'Aug. 2nd', 'Aug. 3rd', 'Aug. 4th', 'Aug. 5th', 
  'Aug. 6th', 'Aug. 7th', 'Aug. 8th', 'Aug. 9th', 'Aug. 10th', 
  'Aug. 11th', 'Aug. 12th', 'Aug. 13th', 'Aug. 14th', 'Aug. 15th', 
  'Aug. 16th'
];

// 示例数据
const dataList = [
  {
    amount: "100000000",
    endTime: "1752758212",
    isUnlocked: true,
    mint: "USDo1uHcFo9H6aHWcqCkhBiWiMhUqQJFienbKDBPEhN",
    owner: "CEcLGJUfo6YXt4AWuv3QHimv1qCA8huN5ZJkNu2McxPW",
    serialNumber: "583648",
    startTime: "1752671727"
  },
  // 可以添加更多数据...
];

// 初始化结果数组（与时间数组长度一致，初始值为0）
const echartReleased = ref(Array.from({ length: timeArray.length }, () => 0));
const echartUnreleased = ref(Array.from({ length: timeArray.length }, () => 0));

/**
 * 将时间戳转换为 "Jul. 17th" 格式
 * @param {string} timestamp - 秒级时间戳
 * @returns {string} 格式化后的日期字符串
 */
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

/**
 * 处理数据：匹配时间并累加金额
 */
function processData() {
  // 重置数组
  echartReleased.value = Array.from({ length: timeArray.length }, () => 0);
  echartUnreleased.value = Array.from({ length: timeArray.length }, () => 0);
  
  dataList.forEach(item => {
    const amount = Number(item.amount) || 0;
    
    // 处理startTime
    const startDateStr = formatTimeToDay(item.startTime);
    const startIndex = timeArray.findIndex(day => day === startDateStr);
    if (startIndex !== -1) {
      echartReleased.value[startIndex] += amount;
    }
    
    // 处理endTime
    const endDateStr = formatTimeToDay(item.endTime);
    const endIndex = timeArray.findIndex(day => day === endDateStr);
    if (endIndex !== -1) {
      echartUnreleased.value[endIndex] += amount;
    }
  });
  
  console.log('处理完成 - echartReleased:', echartReleased.value);
  console.log('处理完成 - echartUnreleased:', echartUnreleased.value);
}

// 组件挂载时处理数据
onMounted(() => {
  processData();
});

// 暴露方法供父组件调用（如需手动触发处理）
defineExpose({
  processData
});
</script>

<style scoped>
.daily-time-processor {
  padding: 20px;
  font-family: Arial, sans-serif;
}

p {
  margin: 8px 0;
  color: #333;
}
</style>
