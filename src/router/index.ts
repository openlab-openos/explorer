import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/dashboard/dashboard.vue";
import Validators from "../views/validators/validators.vue";
import Blocks from "../views/blocks/Blocks.vue"
import Address from "../views/Search/search.vue"
import Block from "../views/Search/block.vue"
import Tx from "../views/Search/tx.vue"
import Transition from "../views/transaction/transactions.vue"
import Epoch from "../views/Search/epoch.vue"

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
    }
  ],
});

export default router;
