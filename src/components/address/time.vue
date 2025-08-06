<template>
  <div class="date-range-container">
    <!-- 切换按钮 -->
    <div class="toggle-buttons">
      <button 
        @click="toggleView('month')" 
        :class="{ active: currentView === 'month' }"
      >
        月视图 (过去20天 + 未来10天)
      </button>
      <button 
        @click="toggleView('year')" 
        :class="{ active: currentView === 'year' }"
      >
        年视图 (过去8个月 + 未来4个月)
      </button>
    </div>

    <!-- 时间范围显示 -->
    <div class="date-range-display">
      {{ formattedRange }}
    </div>

    <!-- 时间段数组展示 -->
    <div class="time-segments">
      <h4>时间段数组 ({{ currentView === 'month' ? '按天' : '按月' }}):</h4>
      <pre>{{ timeSegments }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 当前视图模式：month 或 year
const currentView = ref('month');

// 月份缩写
const months = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 
  'May.', 'Jun.', 'Jul.', 'Aug.', 
  'Sep.', 'Oct.', 'Nov.', 'Dec.'
];

/**
 * 获取日期的序数词后缀
 */
function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * 格式化日期为 Jan. 1st, 2025 格式
 */
function formatDate(date) {
  const month = months[date.getMonth()];
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const year = date.getFullYear();
  return `${month} ${day}${suffix}, ${year}`;
}

/**
 * 计算时间范围
 */
const dateRange = computed(() => {
  const now = new Date();
  
  if (currentView.value === 'month') {
    // 月视图：过去20天至未来10天
    const start = new Date(now);
    start.setDate(start.getDate() - 20);
    
    const end = new Date(now);
    end.setDate(end.getDate() + 10);
    
    return { start, end };
  } else {
    // 年视图：过去8个月至未来4个月
    const start = new Date(now);
    start.setMonth(start.getMonth() - 8); // 过去8个月
    
    const end = new Date(now);
    end.setMonth(end.getMonth() + 4); // 未来4个月
    
    return { start, end };
  }
});

/**
 * 格式化显示的时间范围
 */
const formattedRange = computed(() => {
  return `${formatDate(dateRange.value.start)} —— ${formatDate(dateRange.value.end)}`;
});

/**
 * 生成时间段数组
 * 月视图：以天为单位
 * 年视图：以月为单位
 */
const timeSegments = computed(() => {
  const { start, end } = dateRange.value;
  const segments = [];
  
  if (currentView.value === 'month') {
    // 月视图：按天生成
    const current = new Date(start);
    while (current <= end) {
      segments.push(formatDate(new Date(current)));
      current.setDate(current.getDate() + 1);
    }
  } else {
    // 年视图：按月生成
    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = months[current.getMonth()];
      segments.push(`${month} ${year}`);
      current.setMonth(current.getMonth() + 1);
    }
  }
  
  return segments;
});

/**
 * 切换视图模式
 */
const toggleView = (view) => {
  currentView.value = view;
};

// 监听时间范围变化，在控制台打印时间段数组
watch(timeSegments, (newSegments) => {
  console.log(`当前${currentView.value === 'month' ? '月' : '年'}视图的时间段数组:`, newSegments);
}, { immediate: true });
</script>

<style scoped>
.date-range-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-buttons {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.toggle-buttons button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-buttons button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.toggle-buttons button:hover:not(.active) {
  border-color: #42b983;
  color: #42b983;
}

.date-range-display {
  font-size: 18px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  word-break: break-all;
}

.time-segments {
  margin-top: 20px;
}

.time-segments h4 {
  margin-bottom: 10px;
  color: #333;
}

.time-segments pre {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
