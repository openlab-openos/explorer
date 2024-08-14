// 书写render函数
import { createApp } from "vue";
import { renderToString } from "@vue/test-utils";

export function render(url) {
    const app = createApp();
    //   获取vue处理完成的数据
    const html = renderToString(app);
    return html;
}