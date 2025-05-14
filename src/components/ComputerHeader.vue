<template>
  <nav>
    <ul>
      <li><router-link to="/accounting-records">分類管理</router-link></li>
      <li><router-link to="/exchange-rate">匯率查詢</router-link></li>
      <li><router-link to="/world-clock">世界時鐘</router-link></li>
      <li><router-link to="/calendar">日曆功能</router-link></li>
      <li><router-link to="/statistics">統計與分析</router-link></li>
    </ul>
    <ul>
      <li v-if="!isAuthenticated">
        <router-link to="/auth/login">登入</router-link>
      </li>
      <li v-if="!isAuthenticated">
        <router-link to="/auth/register">註冊</router-link>
      </li>
      <li v-if="isAuthenticated">
        <a href="#" @click.prevent="logOut">登出</a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted, } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isAuthenticated = ref(false);
const user = ref({});

// 檢查登入狀態
async function checkAuth() {
  try {
    const response = await axios.get("http://localhost:5000/auth/checkLogin", {
      withCredentials: true,
    });

    isAuthenticated.value = response.data.isAuthenticated;
    user.value = response.data.user || null;
  } catch (error) {
    isAuthenticated.value = false;
    user.value = null;
  }
}

const logOut = async () => {
  try {
    await axios.post(
      "http://localhost:5000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    isAuthenticated.value = false;
    user.value = null;
    router.push("/auth/login");
  } catch (error) {
    console.error("登出失敗:", error);
  }
};

// 組件掛載時檢查
onMounted(() => {
  checkAuth();

  // 可選：添加路由切換時檢查（針對單頁應用）
  router.afterEach(() => {
    checkAuth();
  });
});
</script>

<style>
nav {
  color: white;
  background-color: #373b3e;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
}

nav a {
  color: inherit;
  /* 移除超連結顏色 */
  font-size: 1.2rem;
  text-decoration: none;
  /* 移除超連結底線 */
}

nav > ul {
  list-style: none;
  /* 移除項目符號 */
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1rem;
}

nav a:hover {
  background-color: rgb(115, 115, 115);
  color: white;
}

/* 添加活動路由連結的樣式 */
.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
