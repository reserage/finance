<template>
  <div>
    <v-btn-group divided class="ma-5"
      ><v-btn @click="showDialog = true">新增時鐘</v-btn>
      <v-btn @click="d">自訂時鐘</v-btn></v-btn-group
    >

    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="c in cities" :key="c._id">
        <CountryCard :city="c" @city-deleted="handleCityDeleted" />
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" width="600">
      <v-card>
        <v-card-title>選擇要顯示的時鐘</v-card-title>
        <v-card-text>
          <v-checkbox
            v-for="city in allCities"
            :key="city._id"
            :label="`${city.name} (${city.country})`"
            v-model="city.isVisible"
            @change="toggleVisibility(city)"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="關閉" @click="showDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import CountryCard from '@/components/CountryCard.vue';
import axios from 'axios';
import { ref, onMounted, onUnmounted, provide } from 'vue';

//* 基本設定
const cities = ref([]); //* 在template使用的( 只有isVisible: true 的 )
const allCities = ref([]); //* 全部 city 資料

//* vuetify設定
const showDialog = ref(false);

//* 全局時間同步器
const globalTimeSync = ref(0);
let syncInterval = null;

onMounted(() => {
  // 計算距離下一秒的毫秒數
  const now = Date.now();
  const msUntilNextSecond = 1000 - (now % 1000);

  // 在下一秒的開始時啟動同步器
  setTimeout(() => {
    globalTimeSync.value++; // 觸發更新
    syncInterval = setInterval(() => {
      globalTimeSync.value++;
    }, 1000);
  }, msUntilNextSecond);
});

onUnmounted(() => {
  if (syncInterval) clearInterval(syncInterval);
});

// 提供給子組件使用
provide('globalTimeSync', globalTimeSync);

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

    // let allCitiesData = worldClockResponse.data.data.cities;

    // 對物件加入 localTime 和 date 屬性

    const exchangeRateResponse = await axios.get(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/TWD`,
      { withCredentials: true }
    );

    const rates = exchangeRateResponse.data.data.rates;

    //* 利用API查詢國家獲得該國貨幣(currenctCode)
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

    cities.value = citiesData.filter((city) => city.isVisible);
    allCities.value = citiesData;
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

async function toggleVisibility(city) {
  try {
    await axios.patch(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/worldClock/${city._id}`,
      { isVisible: city.isVisible } ,
      { withCredentials: true }
    );
  } catch (error) {
    console.log(error);
  }

  if (city.isVisible) {
    cities.value.push(city);
  } else {
    const index = cities.value.findIndex((c) => c._id == city._id);
    cities.value.splice(index, 1);
  }
}
</script>
<style scoped></style>
