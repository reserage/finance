// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/`,
  timeout: 5000,
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // HTTP 錯誤
      console.error(
        `API 錯誤 [${error.response.status}]:`,
        error.response.data
      );
      if (error.response.status === 401) {
        // 例如: 未登入，導向登入頁
        window.location.href = '/login';
      } else if (error.response.status === 400) {
        //* 填寫事件時，若有欄位未填寫完整，會回傳 400 錯誤
        if (error.response.data.message === 'Missing required fields') {
          alert('請填寫所有必填欄位');
        }
      }
    } else if (error.request) {
      console.error('伺服器無回應');
    } else {
      console.error('請求設定錯誤:', error.message);
    }
    return Promise.reject(error); // 繼續把錯誤丟出去
  }
);

export default api;
