// import { createSSRApp } from 'vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import mitt from 'mitt';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
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
// import { createApp } from 'vue';
import vueMatomo from "vue-matomo";


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

const emitter = mitt();

let paini = createPinia();
paini.use(piniaPersist);

const app = createApp(App);

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
app.use(Vue3ProgressPlugin);
app.use(PerfectScrollbar);

app.config.globalProperties.emitter = emitter;
app.use(vueMatomo, {
    host: 'https://stats.openverse.network',
    siteId: 7,
})
app.mount('#app');

window._paq.push(['trackPageView']); //To track pageview

// export default function createApp() {
//     const app = createSSRApp(App);
//     let painia = createPinia();

//     app.component('Card', Card);
//     app.component('CardBody', CardBody);
//     app.component('CardHeader', CardHeader);
//     app.component('CardFooter', CardFooter);
//     app.component('CardGroup', CardGroup);
//     app.component('CardImgOverlay', CardImgOverlay);
//     app.component('CardExpandToggler', CardExpandToggler);

//     app.use(painia);
//     app.use(router);
//     app.use(Vue3ProgressPlugin);
//     app.use(PerfectScrollbar);

//     app.config.globalProperties.emitter = emitter;
//     return { app, router, painia };
// }
