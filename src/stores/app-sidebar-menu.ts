import { defineStore } from 'pinia';

// const currentUrl = window.location.href;
// // @ts-ignore
// let app = JSON.parse(sessionStorage.getItem("app"));
// // @ts-ignore
// let GeturlType = JSON.parse(sessionStorage.getItem("urlType"));
// let url = currentUrl.includes("?cluster=devnet");
// // 假设 urlType 是一个全局状态变量，这里先定义为 false 作为示例
// let urlType = app
//   ? GeturlType
//     ? GeturlType.urlType == "Test"
//       ? false
//       : app.chainType == "Test"
//         ? false
//         : true
//     : true
//   : url
//     ? false
//     : true;
export const useAppSidebarMenuStore = defineStore({
  id: "appSidebarMenu",
  state: () => {
    return [
      {
        text: "navigation.title",
        is_header: true,
      },
      {
        url: "/",
        icon: "bi bi-house-door",
        text: "navigation.dashboard",
        type: false,
      },
      {
        // url: urlType ? "tokens" : "tokens\\?cluster=devnet",
        url: "tokens",
        icon: "bi bi-x-diamond",
        text: "navigation.tokens",
        type: false,
      },
      {
        url: "validators",
        // path: urlType
        //   ? "validators/:url?"
        //   : "validators/:url?\\?cluster=devnet",
        icon: "bi bi-columns-gap",
        text: "navigation.validators",
        type: false,
      },
      {
        url: "blocks",
        // path: urlType ? "block/:url?" : "block/:url?\\?cluster=devnet",
        icon: "bi bi-bar-chart",
        text: "navigation.blocks",
        type: false,
      },
      {
        url: "transactions",
        // path: urlType ? "transactions" : "transactions\\?cluster=devnet",
        icon: "bi bi-layout-sidebar",
        text: "navigation.transactions",
        type: false,
      },
      // {
      //   'url': "faucet",
      //   'icon': 'bi bi-collection',
      //   'text': 'navigation.faucet',
      //   'type': false
      // },
      {
        text: "navigation.links",
        is_header: true,
      },
      {
        url: "https://www.openverse.network",
        icon: "bi bi-grid",
        text: "navigation.website",
        type: true,
      },
      {
        url: "https://openwallet.dev/",
        icon: "bi bi-credit-card fa-fw fa-lg",
        text: "navigation.wallet",
        type: true,
      },
      {
        url: "https://download.openverse.network/",
        icon: "bi bi-file-text",
        text: "navigation.document",
        type: true,
      },
      {
        url: "https://docs.openos.info/",
        icon: "bi bi-person-square",
        text: "developer",
        type: true,
      },
      {
        url: "https://github.com/orgs/openlab-openos/repositories",
        icon: "bi bi-github",
        text: "Github",
        type: true,
      },
    ];
  },
});
