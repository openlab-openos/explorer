import { createI18n } from "vue-i18n";
import enUS from "./locales/en_US.json";
import zhCN from "./locales/zh-CN.json";
import jpJP from "./locales/jp_JP.json";
import krKR from './locales/kr_KR.json';
import deDE from "./locales/de_DE.json";
import ruRU from "./locales/ru_RU.json";
import myMY from "./locales/my_MY.json";
import vnVN from "./locales/vn_VN.json";
import hkHK from "./locales/hk_HK.json";
let i18n = new createI18n({
    locale: "en-US",//默认语
    messages: {
        "en-US":enUS,
        "zh-CN":zhCN,
        "jp-JP":jpJP,
        "kr-KR":krKR,
        "de-DE":deDE,
        "ru-RU":ruRU,
        "my-MY":myMY,
        "vn-VN":vnVN,
        "hk-HK":hkHK
    }
})

export default i18n;
// export type I18nType = typeof i18n;