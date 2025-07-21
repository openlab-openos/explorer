
import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import Tokens from '../views/asset/asset_list.vue';
import Blocks from '../views/blocks/Blocks.vue';
import Dashboard from '../views/dashboard/dashboard.vue';
import Faucet from '../views/Faucet/Faucet.vue';
import Details from '../views/Search/adress/components/details.vue';
import Block from '../views/Search/block.vue';
import Epoch from '../views/Search/epoch.vue';
import Address from '../views/Search/search.vue';
import Tx from '../views/Search/tx.vue';
import Transition from '../views/transaction/transactions.vue';
import Validators from '../views/validators/validators.vue';
import TokenReputation from '@/views/reputation/tokenReputation.vue';

// const currentUrl = window.location.href;

// // @ts-ignore
// let app = JSON.parse(sessionStorage.getItem("app"));
// // @ts-ignore
// let GeturlType = JSON.parse(sessionStorage.getItem("urlType"));
// let url = currentUrl.includes("?cluster=devnet");

// // 初始化 urlType
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

// console.log(urlType, "urlType");
// console.log(url);

// // @ts-ignore
// let Dev = sessionStorage.getItem("Dev")
//   ? sessionStorage.getItem("Dev")
//   : url
//     ? "Dev"
//     : "Mint";

// console.log(sessionStorage.getItem("Dev"));

// // 用于避免循环调用的标志
// let isProcessing = false;

// 浅比较两个对象
// function shallowEqual(objA, objB) {
//   if (objA === objB) return true;
//   if (typeof objA !== 'object' || objA === null || 
//       typeof objB !== 'object' || objB === null) {
//     return false;
//   }
  
//   const keysA = Object.keys(objA);
//   const keysB = Object.keys(objB);
  
//   if (keysA.length !== keysB.length) return false;
  
//   for (let key of keysA) {
//     if (objA[key] !== objB[key]) return false;
//   }
  
//   return true;
// }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/validators/:url?",
      name: "validators",
      component: Validators,
    },
    {
      path: "/blocks/:url?",
      name: "blocks",
      component: Blocks,
    },
    {
      path: "/address/:url?",
      name: "address",
      component: Address,
    },
    {
      path: "/block/:url?",
      name: "block",
      component: Block,
    },
    {
      path: "/tx/:item?",
      name: "tx",
      component: Tx,
    },
    {
      path: "/transactions",
      name: "transactions",
      component: Transition,
    },
    {
      path: "/epoch/:num?",
      name: "epoch",
      component: Epoch,
    },
    {
      path: "/tokens",
      name: "tokens",
      component: Tokens,
    },
    {
      path: "/faucet",
      name: "faucet",
      component: Faucet,
    },
    {
      path: "/details",
      name: "details",
      component: Details,
    },
    {
      path: "/token-reputation",
      name: "TokenReputation",
      component: TokenReputation,
    },
  ],
});

export default router;


