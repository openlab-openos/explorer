// import { createSSRApp } from 'vue';
import { createApp, onMounted } from 'vue';
import { createPinia } from 'pinia';
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import mitt from 'mitt';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
// @ts-ignore
import i18n from './i18n';
// import '@marcoschulte/vue3-progress/dist/index.css';
// import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
// import '@fortawesome/fontawesome-free/scss/regular.scss';
// import '@fortawesome/fontawesome-free/scss/solid.scss';
// import '@fortawesome/fontawesome-free/scss/brands.scss';
// import '@fortawesome/fontawesome-free/scss/v4-shims.scss';
// @ts-ignore
import { FontAwesomeIcon } from './fontawesome';
import 'bootstrap-icons/font/bootstrap-icons.css';
import piniaPersist from "pinia-plugin-persist";
import VueApexCharts from "vue3-apexcharts";

// import { createApp } from 'vue';
import vueMatomo from "vue-matomo";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';
import { PROGRAM_NAMES, LOADER_IDS, PROGRAM_INFO_BY_ID } from "../src/program";


import 'bootstrap';
import './scss/styles.scss';

import App from './App.vue';
import router from './router';

import Card from '@/components/bootstrap/Card.vue';
import CardBody from '@/components/bootstrap/CardBody.vue';
import CardHeader from '@/components/bootstrap/CardHeader.vue';
import CardFooter from '@/components/bootstrap/CardFooter.vue';
import CardGroup from '@/components/bootstrap/CardGroup.vue';
import CardImgOverlay from '@/components/bootstrap/CardImgOverlay.vue';
import CardExpandToggler from '@/components/bootstrap/CardExpandToggler.vue';
import * as buffer from "buffer"; //引入buffer
import { useAppStore } from "@/stores/index";
// import { useHead } from "../node_modules/@unhead/vue";

if (typeof (window as any).Buffer === "undefined") { // 判断当前环境是否有Buffer对象

    (window as any).Buffer = buffer.Buffer; // Buffer对象不存在则创建导入的buffer
} else {

}

onMounted(() => {

})

const emitter = mitt();
const appStore = useAppStore();
let paini = createPinia();
paini.use(piniaPersist);

const app = createApp(App);
console.log(router);

app.config.globalProperties.$progream = PROGRAM_INFO_BY_ID;
// @ts-ignore
app.use(VueApexCharts);
app.component('apexchart', VueApexCharts)

app.component('Card', Card);
app.component('CardBody', CardBody);
app.component('CardHeader', CardHeader);
app.component('CardFooter', CardFooter);
app.component('CardGroup', CardGroup);
app.component('CardImgOverlay', CardImgOverlay);
app.component('CardExpandToggler', CardExpandToggler);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(paini);
app.use(router);
app.use(i18n);
app.use(ElementPlus);
app.use(Vue3ProgressPlugin);
app.use(PerfectScrollbar);


app.config.globalProperties.emitter = emitter;
app.use(vueMatomo, {
    host: 'https://stats.openverse.network',
    siteId: 7,
})
app.mount('#app');
// @ts-ignore
window._paq.push(['trackPageView']); //To track pageview