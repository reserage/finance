import { ref, onMounted } from 'vue';
import axios from 'axios';

function useExchangeRate() {
  let supportedCurrencies = ref([]);
  const isPopularCurrency = ref(true);

  //* 抓取可用的貨幣代碼
  onMounted(async () => {
    const url = isPopularCurrency.value
      ? `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/popular`
      : `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/available`;

    const response = await axios.get(url);

    response.data.data.code.forEach((item) => {
      supportedCurrencies.value.push(
        `${item.chineseName || item.name}(${item.code})`
      );
    });
  });

  //* 取得特定日期的匯率
  const getExchangeRateByDate = async (currency, date) => {
    const response = await axios.get(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/${currency}?date=${date}`
    );
    return response.data.data;
  };

  //* 取得最新的匯率
  const getLatestExchangeRate = async (currency) => {
    const response = await axios.get(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/${currency}`
    );

    return response.data.data;
  };

  return { supportedCurrencies, getExchangeRateByDate, getLatestExchangeRate };
}

export default useExchangeRate;
