// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import ComputerExchangeRate from "@/components/ComputerExchangeRate.vue";
import ComputerAccountingRecords from "@/components/ComputerAccountingRecords.vue";
import HomeView from "@/views/HomeView.vue";
import ExampleView from "@/views/ExampleView.vue";
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
  },
  {
    path: "/example",
    component: ExampleView,
  },
  {
    path: "/auth/register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/auth/login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/statistics",
    component: () => import("@/views/StatisticsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
