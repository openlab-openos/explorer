// 新入口文件
import createApp from "./main";
import vueMatomo from "vue-matomo";


const { app, router, painia } = createApp();

app.use(painia).use(router).use(vueMatomo, {
    host: 'https://openverse.live',
    siteId: 7,
}).mount("#app");

window._paq.push(['trackPageView']); //To track pageview