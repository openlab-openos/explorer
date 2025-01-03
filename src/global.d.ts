// 引入 Buffer 类型
import { Buffer } from 'buffer/';

// 声明 Buffer 为全局变量
declare global {
  var Buffer: typeof Buffer;
}

// 如果你还想通过 this.$buffer 访问 Buffer，可以添加这个声明
import { App, ComponentCustomProperties } from 'vue';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $buffer: typeof Buffer;
  }
}