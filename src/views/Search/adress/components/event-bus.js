// event-bus.js
import { ref } from 'vue';

// 数据存储
const dataArray = ref([]);

// 事件监听器
const listeners = {};

// 注册事件监听
export const on = (event, callback) => {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
};

// 触发事件
export const emit = (event, data) => {
  if (listeners[event]) {
    listeners[event].forEach(callback => callback(data));
  }
};

// 设置数据
export const setData = (data) => {
  dataArray.value = data;
  emit('data-updated', data); // 触发数据更新事件
};

// 获取数据
export const getData = () => {
  return dataArray.value;
};