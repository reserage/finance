<template>
  <v-app-bar v-if="isMobile">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>
  <v-navigation-drawer
    expand-on-hover
    :rail="!isMobile"
    :temporary="isMobile"
    v-model="drawer"
  >
    <v-list>
      <v-list-item
        :prepend-avatar="userThumbnail"
        :subtitle="userInfo.email"
        :title="userInfo.name || '未登入'"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        value="HomeView"
        @click="currentView = 'HomeView'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-bar"
        title="統計與分析"
        value="StatisticsView"
        @click="currentView = 'StatisticsView'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-calendar"
        title="日歷"
        value="CalendarView"
        @click="currentView = 'CalendarView'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-login"
        title="登入"
        value="LoginView"
        v-if="!isAuthenticated"
        @click="currentView = 'LoginView'"
      ></v-list-item>
      <v-list-item
        prepend-icon="	mdi-account-plus"
        title="註冊"
        value="RegisterView"
        v-if="!isAuthenticated"
        @click="currentView = 'RegisterView'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        title="登出"
        value="logout"
        v-if="isAuthenticated"
        @click="handleLogOut"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        title="測試"
        value="logout"
        v-if="isAuthenticated"
        @click="currentView = 'ExampleView'"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        title="記帳本"
        value="logout"
        v-if="isAuthenticated"
        @click="currentView = 'BookKeepingView'"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useDisplay } from "vuetify/lib/composables/display";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const { mdAndDown } = useDisplay();

// 使用 Vuetify 的 display composable 來檢測螢幕大小
const isMobile = computed(() => mdAndDown.value);
watch(isMobile, () => {
  console.log(isMobile.value);
});

const drawer = ref(!isMobile.value);
// 計算圖片路徑
const userThumbnail = computed(() =>
  userInfo.value.thumbnail
    ? userInfo.value.thumbnail
    : new URL("@/assets/NoImage.png", import.meta.url).href
);

// 取得用戶信息並確認是否登入
let userInfo = ref({});
const isAuthenticated = ref(false);
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/auth/checkLogin", {
      withCredentials: true,
    });
    isAuthenticated.value = res.data.isAuthenticated;
    userInfo.value = res.data.user;
    console.log("User Info:", userInfo);
  } catch (e) {
    isAuthenticated.value = false;
    console.error("Error checking login status:", e);
  }
});

watch(
  () => route.fullPath,
  async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/checkLogin", {
        withCredentials: true,
      });
      isAuthenticated.value = res.data.isAuthenticated;
      userInfo.value = res.data.user;
      console.log("User Info:", userInfo);
    } catch (e) {
      isAuthenticated.value = false;
      console.error("Error checking login status:", e);
    }
  }
);

function handleLogOut() {
  axios
    .post(
      "http://localhost:5000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    )
    .then(() => {
      isAuthenticated.value = false;
      userInfo.value = {};
      router.push({ name: "LoginView" });
    })
    .catch((error) => {
      console.error("登出失敗:", error);
    });
}

const currentView = ref("");

watch(currentView, (newValue) => {
  console.log("View changed to:", newValue);
  router.push({ name: newValue });
});
</script>
