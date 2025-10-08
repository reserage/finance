<template>
  <div>
    <div class="container mt-5 mb-3">
      <!-- 日期選擇器保持不變 -->
      <div class="form-group">
        <label class="form-label" for="selectedDate">選擇月份</label>
        <select class="form-select" id="selectedDate" v-model="selectedDate">
          <option v-for="month in optionsMonths" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <!-- 摘要區塊 -->
        <div class="col-12 col-lg-8 mb-4">
          <div class="summary bg-light p-3 border rounded text-center">
            <div class="d-flex justify-content-evenly">
              <div class="expendtiure">
                <h2>本月收入</h2>
                <h3>{{ currentMonthIncome }}</h3>
              </div>
              <div class="line border"></div>
              <div class="income">
                <h2>本月支出</h2>
                <h3>{{ currentMonthExpenditure }}</h3>
              </div>
            </div>
          </div>

          <!-- top5類別區塊 -->
          <div class="new card bg-light p-3 mt-4">
            <h3 class="card-title">高消費類別</h3>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <!-- button的內容由後端提供 -->
                <button
                  type="button"
                  class="list-group-item list-group-item-action"
                  v-for="(category, index) in highSpendingCategories"
                  :key="index"
                >
                  <h5>{{ index + 1 + '.' + category[0] }}</h5>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 餅圖區塊 -->
        <div class="col-12 col-lg-4 mb-4">
          <div
            class="outsidePieChartContainer bg-light border rounded d-flex flex-column justify-content-center align-items-center p-3 h-100"
          >
            <h2>支出分類比例</h2>
            <div class="pie-chart-container w-100" style="height: 300px">
              <!-- 這張圖測試過了，目前上是好的 -->
              <PieChart :chart-data="pieData" :chart-options="pieOptions" />
            </div>
          </div>
        </div>

        <!-- 折線圖區塊 -->
        <div class="col-12 mb-4">
          <div class="lineChart card bg-light p-3">
            <div
              class="card-title d-flex justify-content-between align-items-center"
            >
              <h2>支出趨勢</h2>
              <div class="btn-group" role="group">
                <input
                  type="radio"
                  class="btn-check"
                  name="btnradio"
                  id="btnradio1"
                  autocomplete="off"
                  value="day"
                  v-model="spendingTrendRadio"
                />
                <label class="btn btn-outline-primary" for="btnradio1"
                  >日</label
                >

                <input
                  type="radio"
                  class="btn-check"
                  name="btnradio"
                  id="btnradio2"
                  autocomplete="off"
                  value="month"
                  v-model="spendingTrendRadio"
                />
                <label class="btn btn-outline-primary" for="btnradio2"
                  >月</label
                >

                <input
                  type="radio"
                  class="btn-check"
                  name="btnradio"
                  id="btnradio3"
                  autocomplete="off"
                  value="year"
                  v-model="spendingTrendRadio"
                />
                <label class="btn btn-outline-primary" for="btnradio3"
                  >年</label
                >
              </div>
            </div>

            <div class="line-chart-container card-body" style="height: 300px">
              <!-- 這個圖有問題， -->
              <PieChart
                :chart-data="lineData"
                :chart-options="lineOptions"
                chart-type="line"
              />
            </div>
          </div>
        </div>

        <!-- 預算對比區塊 -->
        <div class="col-12 mb-4">
          <div class="card bg-light p-3">
            <h2 class="card-title">預算對比</h2>
            <div class="card-body">
              <div class="barChartContainer">
                <PieChart
                  :chart-data="barData"
                  :chart-options="barOptions"
                  chart-type="bar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PieChart from '@/components/PieChart.vue';
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';

let pieLabels = ref([]);
let pieMoney = ref([]);

const pieData = computed(() => ({
  labels: pieLabels.value,
  datasets: [
    {
      label: '支出',
      data: pieMoney.value,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
      ],
    },
  ],
}));

const pieOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      align: 'cneter',
      labels: {
        boxWidth: 20,
        boxHeight: 10,
        padding: 20,
      },
    },
  },
});

let lineLabels = ref([]);
let lineMoney = ref([]);

const lineData = computed(() => ({
  labels: lineLabels.value, // X 軸標籤，後端提供
  datasets: [
    {
      label: '支出', // 數據集標籤
      data: lineMoney.value, // 數據點，後端提供
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // 填充顏色
      borderColor: 'rgba(75, 192, 192, 1)', // 線條顏色
      borderWidth: 2, // 線條寬度
      tension: 0.2, // 曲線張力 (0 為直線)
    },
  ],
}));

const lineOptions = ref({
  responsive: true, // 圖表是否響應式
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true, // Y 軸從 0 開始
    },
  },
});

//* barData
const barData = computed(() => ({
  labels: categories,
  datasets: [
    {
      label: '實際支出',
      data: actualExpense,
      backgroundColor: 'rgba(244, 67, 54, 0.7)',
      borderColor: 'rgba(244, 67, 54, 1)',
      borderWidth: 2,
      borderRadius: 5,
    },
    {
      label: '設定預算',
      data: budgetLimit,
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      borderRadius: 5,
    },
  ],
}));

const barOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '各類別支出 vs 預算',
      font: {
        size: 18,
        weight: 'bold',
      },
      padding: 20,
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += '$' + context.parsed.y.toLocaleString();

          // 如果是實際支出，顯示與預算的差異
          if (context.datasetIndex === 0) {
            const budget = budgetLimit[context.dataIndex];
            const diff = context.parsed.y - budget;
            if (diff > 0) {
              label += ' (超支 $' + diff.toLocaleString() + ')';
            } else if (diff < 0) {
              label += ' (節省 $' + Math.abs(diff).toLocaleString() + ')';
            }
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return '$' + value.toLocaleString();
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
});

const categories = ['飲食', '交通', '娛樂', '購物', '水電', '其他'];
const actualExpense = [12000, 3500, 8000, 15000, 5000, 5000];
const budgetLimit = [10000, 4000, 6000, 18000, 5000, 7000];

const selectedDate = ref('default');
const spendingTrendRadio = ref('month');
const optionsMonths = ref([]);

const currentMonthIncome = ref('');
const currentMonthExpenditure = ref();
const highSpendingCategories = ref([]);

// 先從後端取得預設月份的資料
onMounted(async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BACKEND_API_URL}/statistics/init`,
      {
        withCredentials: true,
      }
    );
    optionsMonths.value = response.data.months;
    selectedDate.value = optionsMonths.value[optionsMonths.value.length - 1]; // 預設選擇最新的月份
    console.log('後端資料:', response.data);

    // 給要用到的資料賦值
    const backendData = response.data.allData.data;
    currentMonthIncome.value = backendData.totalIncome;
    currentMonthExpenditure.value = backendData.totalExpense;
    highSpendingCategories.value = backendData.sorted;
    pieLabels.value = backendData.sorted.map((item) => item[0]);
    pieMoney.value = backendData.sorted.map((item) => item[1]);

    getAndSetLineChartData(spendingTrendRadio.value, selectedDate.value);
  } catch (error) {
    console.log(error);
  }
});

watch(selectedDate, async (newValue) => {
  const response = await axios.get(
    `${process.env.VUE_APP_BACKEND_API_URL}/statistics`,
    {
      params: { selectedDate: newValue },
      withCredentials: true,
    }
  );
  console.log('後端資料:', response.data);

  const backendData = response.data.data;
  currentMonthIncome.value = backendData.totalIncome;
  currentMonthExpenditure.value = backendData.totalExpense;
  highSpendingCategories.value = backendData.sorted;

  pieLabels.value = backendData.sorted.map((item) => item[0]);
  pieMoney.value = backendData.sorted.map((item) => item[1]);

  getAndSetLineChartData(spendingTrendRadio.value, newValue);
});

watch(spendingTrendRadio, (newValue) => {
  getAndSetLineChartData(newValue, selectedDate.value);
});

async function getAndSetLineChartData(spendingTrendRadio, selectedDate) {
  const lineResponse = await axios.get(
    `${process.env.VUE_APP_BACKEND_API_URL}/statistics/line`,
    {
      params: {
        selectedDate: selectedDate,
        spendingTrendRadio: spendingTrendRadio,
      },
      withCredentials: true,
    }
  );
  console.log('折線圖後端資料:', lineResponse.data);

  const lineBackendData = lineResponse.data;
  if (spendingTrendRadio === 'month') {
    lineLabels.value = lineBackendData.map((item) => item.week.slice(-1));
  } else {
    lineLabels.value = lineBackendData.map((item) => item.month.slice(-2));
  }
  lineMoney.value = lineBackendData.map((item) => item.totalAmount);
}
</script>

<style scoped>
/* 移除原有的 grid-container 相關樣式 */
.outsidePieChartContainer {
  grid-area: pie;
}

.pie-chart-container {
  width: 90%;
}

.summary {
  grid-area: sum;
}

.lineChart {
  grid-area: lin;
}

.line-chart-container {
  width: 100%;
}
/* 添加一些自定義調整 */
.line {
  height: 80px;
  align-self: center;
}

@media (max-width: 992px) {
  .line {
    height: auto;
    width: 1px;
    margin: 0 1rem;
  }
}

.pie-chart-container,
.line-chart-container {
  position: relative;
}

.list-group-item {
  font-size: 1.1rem;
}

.list-group-item:hover:not(.active):not(.disabled) {
  background-color: #d0ebff; /* 比預設更明顯的藍色 */
  font-weight: bold;
  color: #000; /* 確保文字對比清楚 */
}

.list-group-item.active {
  background-color: #0d6efd; /* 更亮眼的藍色 */
  color: white;
  font-weight: bold;
  border-color: #0a58ca;
}
</style>
