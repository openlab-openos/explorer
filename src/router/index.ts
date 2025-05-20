import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/dashboard/dashboard.vue";
import Validators from "../views/validators/validators.vue";
import Blocks from "../views/blocks/Blocks.vue";
import Address from "../views/Search/search.vue";
import Block from "../views/Search/block.vue";
import Tx from "../views/Search/tx.vue";
import Transition from "../views/transaction/transactions.vue";
import Epoch from "../views/Search/epoch.vue";
import Tokens from "../views/asset/asset_list.vue";
import Faucet from "../views/Faucet/Faucet.vue"
import { useAppStore } from "@/stores";


const currentUrl = window.location.href;

let app = JSON.parse(sessionStorage.getItem('app'));
let GeturlType = JSON.parse(sessionStorage.getItem('urlType'));
let url = currentUrl.includes('?cluster=devnet')
// 假设 urlType 是一个全局状态变量，这里先定义为 false 作为示例
let urlType = app ? (GeturlType? (GeturlType.urlType == 'Test' ? false : (app.chainType == 'Test' ? false : true)) : true ) : (url? false : true) ;

// 用于避免循环调用的标志
let isProcessing = false;
// Test
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
    }
  ],
});

// 全局导航守卫
router.beforeEach((to, from, next) => {
  if (isProcessing) {
      // 如果正在处理中，直接放行，避免死循环
      isProcessing = false;
      next();
      return;
  }

  // 克隆原有的查询参数对象，避免修改原对象
  const existingQuery = { ...to.query };
  let shouldRedirect = false;
  
  if (!urlType && to.path!== "/") {
      // 需要添加 cluster=devnet 参数
      if (existingQuery.cluster!== "devnet") {
          existingQuery.cluster = "devnet";
          shouldRedirect = true;
      }
  } else {
      // 需要移除 cluster 参数
      if (existingQuery.cluster) {
          delete existingQuery.cluster;
          shouldRedirect = true;
      }
  }

  if (shouldRedirect) {
      isProcessing = true;
      // 构建新的查询参数字符串
      const queryString = new URLSearchParams(existingQuery).toString();
      // 构建新的路径
      const newPath = to.path + (queryString.length > 0? `?${queryString}` : "");
      // 进行跳转，并带上新的路径和查询参数
      next({ path: newPath, query: existingQuery });
  } else {
      next();
  }
});

export default router;
