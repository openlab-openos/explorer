import { defineStore } from 'pinia';

import tokensChecked from '../assets/navigator/assets-checked.png';
import tokens from '../assets/navigator/assets.png';
import blackHoldChecked from '../assets/navigator/blocks-checked.png';
import blocksChecked from '../assets/navigator/blocks-checked.png';
import blackHole from '../assets/navigator/blocks.png';
import blocks from '../assets/navigator/blocks.png';
import dashboardChecked from '../assets/navigator/dashboard-checked.png';
import dashboard from '../assets/navigator/dashboard.png';
import developer from '../assets/navigator/developer.png';
import document from '../assets/navigator/document.png';
import github from '../assets/navigator/github.png';
import transactionsChecked from '../assets/navigator/transaction-checked.png';
// import transactionsChecked from '../assets/navigator/transactiosn-checked.png';
import transactions from '../assets/navigator/transactiosn.png';
import validatorsChecked from '../assets/navigator/validators-checked.png';
import validators from '../assets/navigator/validators.png';
import wallet from '../assets/navigator/wallet.png';
import website from '../assets/navigator/website.png';

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
function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
  return !(
    hostname.startsWith("devnet.") || hostname.startsWith("test-devnet.")
  );
}

const UtlDevnetType = isProductionDomain();
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
        // icon: "bi bi-house-door",
        img: dashboard,
        checkedImg: dashboardChecked,
        text: "navigation.dashboard",
        type: false,
      },
      UtlDevnetType
        ? {
            // url: urlType ? "tokens" : "tokens\\?cluster=devnet",
            url: "tokens",
            // icon: "bi bi-x-diamond",
            img: tokens,
            checkedImg: tokensChecked,
            text: "navigation.tokens",
            type: false,
          }
        : {},
      {
        url: "validators",
        // path: urlType
        //   ? "validators/:url?"
        //   : "validators/:url?\\?cluster=devnet",
        // icon: "bi bi-columns-gap",
        img: validators,
        checkedImg: validatorsChecked,
        text: "navigation.validators",
        type: false,
      },
      {
        url: "blocks",
        // path: urlType ? "block/:url?" : "block/:url?\\?cluster=devnet",
        // icon: "bi bi-bar-chart",
        img: blocks,
        checkedImg: blocksChecked,
        text: "navigation.blocks",
        type: false,
      },
      {
        url: "transactions",
        // path: urlType ? "transactions" : "transactions\\?cluster=devnet",
        // icon: "bi bi-layout-sidebar",
        img: transactions,
        checkedImg: transactionsChecked,
        text: "navigation.transactions",
        type: false,
      },
      {
        url: "blackhole",
        // path: urlType ? "transactions" : "transactions\\?cluster=devnet",
        // icon: "bi bi-airplane-fill",
        img: blackHole,
        checkedImg: blackHoldChecked,
        text: "navigation.blackhole",
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
        // icon: "bi bi-grid",
        img: website,
        text: "navigation.website",
        type: true,
      },
      {
        url: "https://openwallet.dev/",
        // icon: "bi bi-credit-card fa-fw fa-lg",
        img: wallet,
        text: "navigation.wallet",
        type: true,
      },
      {
        url: "https://download.openverse.network/",
        // icon: "bi bi-file-text",
        img: document,
        text: "navigation.document",
        type: true,
      },
      {
        url: "https://docs.openos.info/",
        // icon: "bi bi-person-square",
        img: developer,
        text: "developer",
        type: true,
      },
      {
        url: "https://github.com/orgs/openlab-openos/repositories",
        // icon: "bi bi-github",
        img: github,
        text: "Github",
        type: true,
      },
    ];
  },
});
