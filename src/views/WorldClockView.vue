<template>
  <div>
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="c in cities" :key="c.id">
        <CountryCard :city="c" @city-deleted="handleCityDeleted" />
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import CountryCard from '@/components/CountryCard.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';

const cities = ref([]);

//* ------------ 獲得世界時鐘資料 ------------ *//
// let exchangeRates = ref(0);
onMounted(async () => {
  try {
    const worldClockResponse = await axios.get(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/worldClock`,
      {
        withCredentials: true,
      }
    );
    let citiesData = worldClockResponse.data.data.cities;
    // 對物件加入 localTime 和 date 屬性

    const exchangeRateResponse = await axios.get(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/TWD`,
      { withCredentials: true }
    );

    const rates = exchangeRateResponse.data.data.rates;

    await Promise.all(
      citiesData.map(async (city) => {
        const getCurrencyCodeResponse = await axios.get(
          `https://restcountries.com/v3.1/name/${city.englishCountryName}`
        );

        const currencyCode = Object.keys(
          getCurrencyCodeResponse.data[0].currencies
        )[0];

        if (rates[currencyCode]) {
          city.exchangeRate = rates[currencyCode];
          city.currencyCode = currencyCode;
        } else {
          city.exchangeRate = 'N/A';
        }
      })
    );

    cities.value = citiesData;
    console.log('世界時鐘資料:', cities.value);
  } catch (error) {
    console.error('Error fetching world clock data:', error);
  }
});

function handleCityDeleted(deletedCityId) {
  console.log('收到刪除城市事件，ID為:', deletedCityId);

  console.log('已刪除城市ID:', deletedCityId);

  window.alert(
    `國家: ${
      cities.value.find((city) => city._id === deletedCityId)
        ?.englishCountryName
    } 城市: ${
      cities.value.find((city) => city._id === deletedCityId)?.name
    } 已刪除`
  );
  cities.value = cities.value.filter((city) => city._id !== deletedCityId);
}
</script>
<style scoped></style>
