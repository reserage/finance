// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import ComputerExchangeRate from "@/components/ComputerExchangeRate.vue";
import ComputerAccountingRecords from "@/components/ComputerAccountingRecords.vue";
import HomeView from "@/views/HomeView.vue";
import AccountBookView from "@/views/AccountBookView.vue";
// 導入其他需要的組件

const routes = [
  {
    path: "/exchange-rate",
    name: "ExchangeRate",
    component: ComputerExchangeRate,
  },
  {
    path: "/accounting-records",
    name: "AccountingRecords",
    component: ComputerAccountingRecords,
  },
  // 添加更多路由
  {
    path: "/",
    component: HomeView,
    name: "HomeView",
  },
  {
    path: "/accountBook",
    component: AccountBookView,
    name: "AccountBookView",
  },
  {
    path: "/auth/register",
    component: () => import("@/views/RegisterView.vue"),
    name: "RegisterView",
  },
  {
    path: "/auth/login",
    component: () => import("@/views/LoginView.vue"),
    name: "LoginView",
  },
  {
    path: "/statistics",
    component: () => import("@/views/StatisticsView.vue"),
    name: "StatisticsView",
  },
  {
    path: "/BookKeeping",
    component: () => import("@/views/BookKeepingView.vue"),
    name: "BookKeepingView",
  },
  {
    path: "/calendar",
    component: () => import("@/views/CalendarView.vue"),
    name: "CalendarView",
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


router.beforeEach((to, from, next) => {
  if (from.matched.some((record) => record.meta.cleanup)) {
    console.log("执行特殊路由清理");
    // 这里可以添加额外的清理逻辑
  }
  next();
});

export default router;
