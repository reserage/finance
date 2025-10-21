<template>
  <div style="position: relative; z-index: 1">
    <v-card
      class="h-100 hover-card"
      :style="{ cursor: 'pointer', transition: 'all 0.3s ease' }"
      @click="expand = !expand"
      style="position: relative; overflow: visible"
      ref="cardRef"
    >
      <v-card-item>
        <v-sheet class="rounded-lg" :style="{ position: 'relative' }">
          <!-- 城市名稱與刪除 -->
          <div class="d-flex justify-space-between align-start">
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">
                {{ city.name }}
              </h2>
              <p class="text-body-2 text-grey">{{ city.country }}</p>
            </div>

            <v-btn
              icon="mdi-delete"
              size="small"
              color="error"
              @click.stop="deleteCity(city._id)"
            ></v-btn>
          </div>

          <!-- 中間：時間與日期 -->
          <div class="d-flex flex-column align-center justify-center">
            <h1 class="text-h4 font-weight-bold mb-1">
              {{ city.localTime }}
            </h1>
            <div class="text-body-2 text-grey">{{ city.date }}</div>
          </div>
        </v-sheet>
        <!-- 展開內容 使用 Teleport -->
        <Teleport v-if="isTeleport" to="body">
          <v-expand-transition>
            <div
              v-show="expand"
              class="expand-content from-bottom"
              :style="expandContentStyle"
            >
              <v-divider></v-divider>
              <v-card-text class="pa-6">
                <v-list-item class="pl-0 pr-0 mb-4">
                  <template #prepend>
                    <v-icon icon="mdi-clock-outline" color="primary"></v-icon>
                  </template>
                  <v-list-item-title>與台北時差小時</v-list-item-title>
                  <template #append>
                    <v-chip text-color="white" size="small">
                      {{ timeDiff }}
                    </v-chip>
                  </template>
                </v-list-item>

                <v-list-item class="pl-0 pr-0 mb-4">
                  <template #prepend>
                    <v-icon icon="mdi-currency-usd" color="success"></v-icon>
                  </template>
                  <v-list-item-title>匯率</v-list-item-title>
                  <template #append>
                    <v-chip color="success" text-color="white" size="small"
                      >1 TWD =>
                      {{
                        city.exchangeRate !== 'N/A'
                          ? city.exchangeRate.toFixed(3)
                          : 'N/A'
                      }}
                      {{ city.currencyCode }}</v-chip
                    >
                  </template>
                </v-list-item>
              </v-card-text>
            </div>
          </v-expand-transition>
        </Teleport>

        <v-expand-transition>
          <div
            v-show="expand && !isTeleport"
            class="expand-content from-bottom"
            :style="expandContentStyle"
          >
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <v-list-item class="pl-0 pr-0 mb-4">
                <template #prepend>
                  <v-icon icon="mdi-clock-outline" color="primary"></v-icon>
                </template>
                <v-list-item-title>與台北時差小時</v-list-item-title>
                <template #append>
                  <v-chip text-color="white" size="small">
                    {{ timeDiff }}
                  </v-chip>
                </template>
              </v-list-item>

              <v-list-item class="pl-0 pr-0 mb-4">
                <template #prepend>
                  <v-icon icon="mdi-currency-usd" color="success"></v-icon>
                </template>
                <v-list-item-title>匯率</v-list-item-title>
                <template #append>
                  <v-chip color="success" text-color="white" size="small"
                    >1 TWD =>
                    {{
                      city.exchangeRate !== 'N/A'
                        ? city.exchangeRate.toFixed(3)
                        : 'N/A'
                    }}
                    {{ city.currencyCode }}</v-chip
                  >
                </template>
              </v-list-item>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup>
import axios from 'axios';
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  watch,
} from 'vue';

const emit = defineEmits(['city-deleted']);

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
});

let city = ref({ ...props.city });

let expand = ref(false);
const cardRef = ref(null);
const expandContentStyle = ref({});

const isTeleport = ref(true); // 總是使用 Teleport

const updateExpandContentPosition = () => {
  if (cardRef.value && expand.value) {
    const rect = cardRef.value.$el.getBoundingClientRect();
    const expandHeight = 200; // 你估算的展開內容高度
    let top = rect.bottom;

    const fullHeight = document.documentElement.scrollHeight;
    const bottomRelativeToPage = rect.bottom + window.scrollY;

    // 如果超過視窗高度，改向上展開
    if (bottomRelativeToPage + expandHeight > fullHeight) {
      isTeleport.value = false;
      return;
    }

    isTeleport.value = true;
    console.log('使用 Teleport 向下展開');

    expandContentStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 9999,
      background: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    };
    return;
  }
};

watch(isTeleport, (newVal) => {
  console.log('isTeleport 改變為:', newVal);
});

watch(expand, (newVal) => {
  console.log('expand 改變為:', newVal);
  isTeleport.value = true;
});

// 監聽展開狀態和窗口大小
onMounted(() => {
  window.addEventListener('resize', updateExpandContentPosition);
  window.addEventListener('scroll', updateExpandContentPosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateExpandContentPosition);
  window.removeEventListener('scroll', updateExpandContentPosition);
});

// 當展開時更新位置
const originalExpand = expand;
expand = computed({
  get: () => originalExpand.value,
  set: (val) => {
    originalExpand.value = val;
    if (val) {
      // 下一幀更新位置
      requestAnimationFrame(updateExpandContentPosition);
    }
  },
});

// city = {
//     name: 'Taipei',
//     country: 'Taiwan',
//     timezoneOffset: 8,
// }

//* ------------ 時間與日期更新邏輯 ------------ *//
function updateTime() {
  const localTime = new Date();
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit', // ✅ 顯示秒數
    hour12: false,
    timeZone: city.value.timezone,
  };
  const optionsDate = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour12: false,
    timeZone: city.value.timezone,
  };

  city.value.localTime = localTime.toLocaleTimeString('zh-TW', optionsTime);
  city.value.date = localTime.toLocaleDateString('zh-TW', optionsDate);
}
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});

//* ------------ 計算與台北的時差 ------------ *//
let timeDiff = ref('');
onMounted(() => {
  timeDiff.value = getTimeDiffString(city.value.timezone);
});

function getTimeDiffString(cityTimeZone) {
  const now = new Date();
  // 台灣時間
  const taiwanTime = now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
  // 城市時間
  const cityTime = now.toLocaleString('en-US', { timeZone: cityTimeZone });

  const taiwanDate = new Date(taiwanTime);
  const cityDate = new Date(cityTime);

  const diffHours = (cityDate - taiwanDate) / 1000 / 3600;
  return diffHours > 0
    ? `快 ${diffHours} 小時`
    : diffHours < 0
    ? `慢 ${Math.abs(diffHours)} 小時`
    : '相同';
}

//* ------------ 刪除城市邏輯 ------------ */

async function deleteCity(cityId) {
  try {
    if (
      window.confirm(
        `確定要刪除 ${city.value.country} - ${city.value.name} 嗎？`
      )
    ) {
      const response = await axios.delete(
        `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/worldClock/${cityId}`,
        {
          withCredentials: true,
        }
      );

      console.log('使用者確認刪除城市');
      if (response.status === 204) {
        emit('city-deleted', cityId);
      } else {
        window.alert('刪除城市失敗，請稍後再試。');
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      window.alert('城市不存在或已被刪除。');
      return;
    }
    console.error('刪除城市時發生錯誤:', error);
    window.alert('刪除城市失敗，請稍後再試。');
    return;
  }
}
</script>

<style scoped></style>
