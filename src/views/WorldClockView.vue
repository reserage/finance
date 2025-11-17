<template>
  <div>
    <v-btn-group divided class="ma-5"
      ><v-btn @click="showDialog = true">新增時鐘</v-btn>
      <v-btn @click="customClock = true">自訂時鐘</v-btn></v-btn-group
    >

    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="c in cities" :key="c._id">
        <CountryCard :city="c" @city-deleted="handleCityDeleted" />
      </v-col>
    </v-row>

    <!-- 新增時鐘的 Dialog -->
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

    <!-- 自訂時鐘的 Dialog -->
    <v-dialog v-model="customClock" width="600">
      <v-card>
        <v-card-title>輸入要新增的時鐘資訊</v-card-title>
        <v-card-text>
          <v-form
            ref="formRef"
            v-model="isValid"
            @submit.prevent="handleSubmit"
          >
            <v-text-field
              v-model="city.name"
              class="mb-2"
              label="城市名稱"
              :rules="[rules.required]"
              outline
            >
            </v-text-field>

            <v-text-field
              v-model="city.country"
              class="mb-2"
              label="國家"
              :rules="[rules.required]"
              outline
            ></v-text-field>

            <v-autocomplete
              v-model="city.timezone"
              :items="timezones"
              label="選擇Iana時區"
              :rules="[rules.required]"
            >
              <template v-slot:divider="{ props }">
                <div class="d-flex ga-4 align-center">
                  <v-divider></v-divider>
                  {{ props.text }}
                  <v-divider></v-divider>
                </div>
              </template>
            </v-autocomplete>

            <v-radio-group
              label="是否立即顯示在頁面上"
              v-model="city.isVisible"
            >
              <v-radio label="顯示" :value="true" color="primary"></v-radio>
              <v-radio label="不顯示" :value="false" color="primary"></v-radio>
            </v-radio-group>

            <v-btn type="submit" color="primary" class="mt-4" block>
              送出
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="關閉" @click="customClock = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :model-value="loading" opacity="0.6">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </div>
</template>
<script setup>
import CountryCard from '@/components/CountryCard.vue';
import axios from 'axios';
import { ref, onMounted, onUnmounted, provide, reactive } from 'vue';
import { useLoading } from '@/composables/useLoading';

const { loading, wrap } = useLoading();

//* 基本設定
const cities = ref([]); //* 在template使用的( 只有isVisible: true 的 )
const allCities = ref([]); //* 全部 city 資料

//* vuetify設定
const showDialog = ref(false);
const customClock = ref(false);

const timezones = [
  { type: 'subheader', title: 'Africa' },
  { title: 'Africa/Abidjan', value: 'Africa/Abidjan' },
  { title: 'Africa/Accra', value: 'Africa/Accra' },
  { title: 'Africa/Addis_Ababa', value: 'Africa/Addis_Ababa' },
  { title: 'Africa/Cairo', value: 'Africa/Cairo' },
  { title: 'Africa/Johannesburg', value: 'Africa/Johannesburg' },

  { type: 'divider', text: 'or' },

  { type: 'subheader', title: 'America' },
  { title: 'America/Adak', value: 'America/Adak' },
  { title: 'America/Anchorage', value: 'America/Anchorage' },
  { title: 'America/Chicago', value: 'America/Chicago' },
  { title: 'America/New_York', value: 'America/New_York' },
  { title: 'America/Los_Angeles', value: 'America/Los_Angeles' },

  { type: 'divider', text: 'or' },

  { type: 'subheader', title: 'Asia' },
  { title: 'Asia/Taipei', value: 'Asia/Taipei' },
  { title: 'Asia/Tokyo', value: 'Asia/Tokyo' },
  { title: 'Asia/Shanghai', value: 'Asia/Shanghai' },
  { title: 'Asia/Singapore', value: 'Asia/Singapore' },
  { title: 'Asia/Kolkata', value: 'Asia/Kolkata' },

  { type: 'divider', text: 'or' },

  { type: 'subheader', title: 'Europe' },
  { title: 'Europe/London', value: 'Europe/London' },
  { title: 'Europe/Berlin', value: 'Europe/Berlin' },
  { title: 'Europe/Paris', value: 'Europe/Paris' },
  { title: 'Europe/Moscow', value: 'Europe/Moscow' },
  { title: 'Europe/Istanbul', value: 'Europe/Istanbul' },

  { type: 'divider', text: 'or' },

  { type: 'subheader', title: 'Pacific' },
  { title: 'Pacific/Auckland', value: 'Pacific/Auckland' },
  { title: 'Pacific/Fiji', value: 'Pacific/Fiji' },
  { title: 'Pacific/Honolulu', value: 'Pacific/Honolulu' },
  { title: 'Pacific/Guadalcanal', value: 'Pacific/Guadalcanal' },
  { title: 'Pacific/Tongatapu', value: 'Pacific/Tongatapu' },
];

const isValid = ref(false);
const formRef = ref(null);

/* 表單資料 */
const city = reactive({
  name: '',
  country: '',
  timezone: '',
  isVisible: true,
});

const rules = {
  required: (v) => !!v || '此欄位必填',
};

const handleSubmit = async () => {
  const result = await formRef.value?.validate();
  if (!result.valid) return;

  console.log('✅ 送出資料：', city);
  await wrap(async () => {
    try {
      await axios.post(
        `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/worldClock`,
        city,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }

    customClock.value = false;
    try {
      await refreshWorldClock();
    } catch (error) {
      console.error(`新增後刷新出現問題  ${error}`);
    }
  });
  // 這裡可發送 API，例如 axios.post('/api/v1/worldClock', city)
};

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
  await wrap(async () => {
    try {
      await refreshWorldClock();
    } catch (error) {
      console.error('Error fetching world clock data:', error);
    }
  });
});

function handleCityDeleted(deletedCityId) {
  console.log('收到刪除城市事件，ID為:', deletedCityId);

  console.log('已刪除城市ID:', deletedCityId);

  window.alert(
    `國家: ${
      cities.value.find((city) => city._id === deletedCityId)?.country
    } 城市: ${
      cities.value.find((city) => city._id === deletedCityId)?.name
    } 已刪除`
  );
  cities.value = cities.value.filter((city) => city._id !== deletedCityId);
}

async function toggleVisibility(city) {
  await wrap(async () => {
    try {
      await axios.patch(
        `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/worldClock/${city._id}`,
        { isVisible: city.isVisible },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  });

  if (city.isVisible) {
    cities.value.push(city);
  } else {
    const index = cities.value.findIndex((c) => c._id == city._id);
    cities.value.splice(index, 1);
  }
}

async function getWorldColck() {
  return await wrap(async () => {
    try {
      const worldClockResponse = await axios.get(
        `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/worldClock`,
        {
          withCredentials: true,
        }
      );
      return worldClockResponse.data.data.cities;
    } catch (error) {
      console.error(`抓取時鐘時出現問題  ${error}`);
      throw error;
    }
  });
}

async function getExchangeRate() {
  return await wrap(async () => {
    try {
      const exchangeRateResponse = await axios.get(
        `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/TWD`,
        { withCredentials: true }
      );

      return exchangeRateResponse.data.data.rates;
    } catch (error) {
      console.error(`抓取匯率時出現問題  ${error}`);
      throw error;
    }
  });
}

async function handleTimezoneOffsetAndExchangeRate(citiesData, rates) {
  try {
    await Promise.all(
      citiesData.map(async (city) => {
        //* 預定的時鐘就查找資料
        if (city.isDefault == true) {
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
          //* 非預定的直接給 'N/A'
        } else {
          city.exchangeRate = 'N/A';
        }
      })
    );
  } catch (error) {
    console.log(`處理時間差 或 匯率 時出現問題  ${error}`);
    throw error;
  }
}

async function refreshWorldClock() {
  try {
    let citiesData = await getWorldColck();

    // let allCitiesData = worldClockResponse.data.data.cities;

    // 對物件加入 localTime 和 date 屬性
    const rates = await getExchangeRate();

    //* 利用API查詢國家獲得該國貨幣(currenctCode)
    await handleTimezoneOffsetAndExchangeRate(citiesData, rates);

    cities.value = citiesData.filter((city) => city.isVisible);
    allCities.value = citiesData;
  } catch (error) {
    console.error(`刷新世界時鐘時出現問題  ${error}`);
    alert('載入世界時鐘失敗，請稍後再試');
  }
}
</script>
<style scoped></style>
