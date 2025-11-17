<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">登入</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="email" class="form-label">email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">密碼</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100">登入</button>
    </form>
    <div class="text-center my-3">或</div>
    <button class="btn btn-danger w-100" @click="loginWithGoogle">
      <i class="bi bi-google me-2"></i> 使用 Google 登入
    </button>

    <v-overlay :model-value="loading" opacity="0.6">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';
import { useLoading } from '@/composables/useLoading';

const { loading, wrap } = useLoading();

const password = ref('');
const email = ref('');

const login = async () => {
  await wrap(async () => {
    try {
      const response = await axios.post(
        `${process.env.VUE_APP_BACKEND_API_URL}/auth/login`,
        {
          password: password.value,
          email: email.value,
        },
        { withCredentials: true } // 確保這裡設置了
      );
      console.log('登入成功', response.data);
      // 登入成功後的處理，如重定向
      router.push('/');
    } catch (error) {
      console.log('error: ', error);
      alert(error.response.data?.message || '登入失敗');
    }
  });
};

const loginWithGoogle = () => {
  // 導向後端的 Google OAuth URL
  window.location.href = `${process.env.VUE_APP_BACKEND_API_URL}/auth/google`;
};
</script>
