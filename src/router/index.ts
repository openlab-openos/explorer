// import {
//   createRouter,
//   createWebHistory,
// } from 'vue-router';

// import Tokens from '../views/asset/asset_list.vue';
// import Blocks from '../views/blocks/Blocks.vue';
// import Dashboard from '../views/dashboard/dashboard.vue';
// import Faucet from '../views/Faucet/Faucet.vue';
// import Details from '../views/Search/adress/components/details.vue';
// import Block from '../views/Search/block.vue';
// import Epoch from '../views/Search/epoch.vue';
// import Address from '../views/Search/search.vue';
// import Tx from '../views/Search/tx.vue';
// import Transition from '../views/transaction/transactions.vue';
// import Validators from '../views/validators/validators.vue';

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
// // Test
// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     {
//       path: "/",
//       name: "dashboard",
//       component: Dashboard,
//     },
//     {
//       // path: "/validators/:url?",
//       path: urlType
//         ? "/validators/:url?"
//         : "/validators/:url?\\?cluster=devnet",
//       name: "validators",
//       component: Validators,
//     },
//     {
//       // path: "/blocks/:url?",
//       path: urlType ? "/blocks/:url?" : "/blocks/:url?\\?cluster=devnet",
//       name: "blocks",
//       component: Blocks,
//     },
//     {
//       // path: "/address/:url?",
//       path: urlType ? "/address/:url?" : "/address/:url?\\?cluster=devnet",
//       name: "address",
//       component: Address,
//     },
//     {
//       // path: "/block/:url?",
//       path: urlType ? "/block/:url?" : "/block/:url?\\?cluster=devnet",
//       name: "block",
//       component: Block,
//     },
//     {
//       // path: "/tx/:item?",
//       path: urlType ? "/tx/:item?" : "/tx/:item?\\?cluster=devnet",
//       name: "tx",
//       component: Tx,
//     },
//     {
//       // path: "/transactions",
//       path: urlType ? "/transactions" : "/transactions\\?cluster=devnet",
//       name: "transactions",
//       // name: urlType ? "transactions" : "transactions\\?cluster=devnet",
//       component: Transition,
//     },
//     {
//       // path: "/epoch/:num?",
//       path: urlType ? "/epoch/:num?" : "/epoch/:num?\\?cluster=devnet",
//       name: "epoch",
//       // name: urlType ? "epoch" : "epoch\\?cluster=devnet",
//       component: Epoch,
//     },
//     {
//       // path: "/tokens",
//       path: urlType ? "/tokens" : "/tokens\\?cluster=devnet",
//       name: "tokens",
//       // name: urlType ? "tokens" : "tokens\\?cluster=devnet",
//       component: Tokens,
//     },
//     {
//       // path: "/faucet",
//       path: urlType ? "/faucet" : "/faucet\\?cluster=devnet",
//       name: "faucet",
//       // name: urlType ? "faucet" : "faucet\\?cluster=devnet",
//       component: Faucet,
//     },
//     {
//       // path: "/details",
//       path: urlType ? "/details" : "/details\\?cluster=devnet",
//       name: "details",
//       // name: urlType ? "details" : "details\\?cluster=devnet",
//       component: Details,
//     },
//   ],
// });

// // 全局导航守卫
// router.beforeEach((to, from, next) => {
//   if (isProcessing) {
//     // 如果正在处理中，直接放行，避免死循环
//     isProcessing = false;
//     next();
//     return;
//   }

//   // 克隆原有的查询参数对象，避免修改原对象
//   const existingQuery = { ...to.query };
//   let shouldRedirect = false;

//   if (!urlType && to.path !== "/") {
//     // 需要添加 cluster=devnet 参数
//     if (existingQuery.cluster !== "devnet") {
//       existingQuery.cluster = "devnet";
//       shouldRedirect = true;
//     }
//   } else {
//     // 需要移除 cluster 参数
//     if (existingQuery.cluster) {
//       delete existingQuery.cluster;
//       shouldRedirect = true;
//     }
//   }
//   console.log(currentUrl.includes("?cluster=devnet"));
//   console.log(Dev);

//   if (shouldRedirect) {
//     isProcessing = true;
//     // 构建新的查询参数字符串
//     // @ts-ignore
//     const queryString = new URLSearchParams(existingQuery).toString();
//     // 构建新的路径
//     const newPath = to.path + (queryString.length > 0 ? `?${queryString}` : "");
//     console.log(Dev);
//     console.log(url);
//     let UrlText = url ? "Dev" : "Mint";
//     console.log(UrlText);

//     if (Dev == UrlText) {
//       console.log(currentUrl.includes("?cluster=devnet"));
//     } else {
//       next();
//       // next({ path: to.path });
//     }
//     // 进行跳转，并带上新的路径和查询参数
//   } else {
//     next();
//   }
// });

// export default router;
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
  ],
});

// // 全局导航守卫
// router.beforeEach((to, from, next) => {
//   if (isProcessing) {
//     // 如果正在处理中，直接放行，避免死循环
//     isProcessing = false;
//     next();
//     return;
//   }

//   try {
//     isProcessing = true;
    
//     // 克隆原有的查询参数对象
//     const existingQuery = { ...to.query };
//     let shouldRedirect = false;
    
//     // 根路径不处理 cluster 参数
//     if (to.path === "/") {
//       if (existingQuery.cluster) {
//         delete existingQuery.cluster;
//         shouldRedirect = true;
//       }
//     } else {
//       // 非根路径处理 cluster 参数
//       if (!urlType && existingQuery.cluster !== "devnet") {
//         // 需要添加 cluster=devnet
//         existingQuery.cluster = "devnet";
//         shouldRedirect = true;
//       } else if (urlType && existingQuery.cluster) {
//         // 需要移除 cluster 参数
//         delete existingQuery.cluster;
//         shouldRedirect = true;
//       }
//     }
    
//     // 处理 Dev 和 UrlText 逻辑
//     let UrlText = url ? "Dev" : "Mint";
//     console.log("Dev:", Dev, "UrlText:", UrlText);
    
//     if (shouldRedirect) {
//       if (Dev !== UrlText) {
//         // 构建新的路由对象
//         const newRoute = {
//           name: to.name,
//           params: to.params,
//           query: existingQuery
//         };
        
//         console.log("[导航守卫] 重定向:", to.fullPath, "→", 
//                     router.resolve(newRoute).href);
        
//         // 使用 replace 避免历史记录冗余
//         next({ ...newRoute, replace: true });
//       } else {
//         console.log("[导航守卫] Dev !== UrlText，不重定向");
//         next();
//       }
//     } else {
//       next();
//     }
//   } catch (error) {
//     console.error("[导航守卫] 错误:", error);
//     next();
//   } finally {
//     isProcessing = false;
//   }
// });

// // 添加更新 urlType 的方法 
// // @ts-ignore
// export function updateUrlType(newUrlType) {
//   console.log("[更新 urlType]", urlType, "→", newUrlType);
//   urlType = newUrlType;
  
//   // 更新 sessionStorage
//   if (newUrlType) {
//     sessionStorage.setItem("Dev", "Mint");
//   } else {
//     sessionStorage.setItem("Dev", "Dev");
//   }
  
//   // 更新 url 变量
//   url = newUrlType ? false : currentUrl.includes("?cluster=devnet");
  
//   // 触发当前路由重新匹配
//   router.push({
//     name: router.currentRoute.value.name,
//     params: router.currentRoute.value.params,
//     query: router.currentRoute.value.query
//   });
// }

// // 添加获取当前环境的方法
// export function getCurrentEnvironment() {
//   return urlType ? "Mint" : "Dev";
// }

export default router;