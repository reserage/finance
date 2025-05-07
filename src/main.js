import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/style.css"; // 引入全局樣式
import router from "./router";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App).use(router).mount("#app");
