import { createI18n } from "vue-i18n";
import enUS from "./locales/en_US.json";
import zhCN from "./locales/zh-CN.json";
let i18n = new createI18n({
    locale: "en-US",//默认语言
    // legacy: false,
    messages: {
        "en-US":enUS,
        "zh-CN":zhCN
    }
})

export default i18n;
// export type I18nType = typeof i18n;