<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">註冊</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="userName" class="form-label">使用者名稱</label>
        <input
          v-model="userName"
          type="text"
          class="form-control"
          id="userName"
          minlength="2"
          maxlength="20"
          required
        />
      </div>
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
          minlength="6"
          maxlength="20"
          required
        />
      </div>
      <button type="submit" class="btn btn-success w-100">註冊</button>
    </form>
    <div class="text-center my-3">或</div>
    <button class="btn btn-danger w-100" @click="registerWithGoogle">
      <i class="bi bi-google me-2"></i> 使用 Google 註冊
    </button>
    <v-overlay :model-value="loading" opacity="0.6">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useLoading } from '@/composables/useLoading';
const { loading, wrap } = useLoading();

const userName = ref('');
const password = ref('');
const email = ref('');

const register = async () => {
  await wrap(async () => {
    try {
      const response = await axios.post(
        `${process.env.VUE_APP_BACKEND_API_URL}/auth/register`,
        {
          username: userName.value,
          password: password.value,
          email: email.value,
        },
        { withCredentials: true }
      );
      if (response.data.registrationSuccess) {
        alert('註冊成功!請登入');
      } else {
        alert('註冊失敗!重試一次');
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  });
};

const registerWithGoogle = () => {
  // 導向後端的 Google OAuth 註冊 URL（通常和登入是一樣的）
  window.location.href = 'http://localhost:5000/auth/google';
};
</script>
