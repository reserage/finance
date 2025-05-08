<template>
  <div class="container mt-5 mb-3">
    <!-- 日期選擇器保持不變 -->
    <div class="form-group">
      <label class="form-label" for="selectedDate">選擇日期</label>
      <select class="form-select" id="selectedDate" v-model="selectedDate">
        <option selected value="default">下拉選擇日期</option>
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
              <h3>$25000</h3>
            </div>
            <div class="line border"></div>
            <div class="income">
              <h2>本月支出</h2>
              <h3>$19000</h3>
            </div>
          </div>
        </div>

        <!-- top5類別區塊 -->
        <div class="new card bg-light p-3 mt-4">
          <h3 class="card-title">高消費類別</h3>
          <div class="card-body">
            <div class="list-group list-group-flush list-group-numbered">
              <!-- button的內容由後端提供 -->
              <button
                type="button"
                class="list-group-item list-group-item-action active"
              >
                lorem
              </button>
              <button
                type="button"
                class="list-group-item list-group-item-action"
              >
                lorem
              </button>
              <button
                type="button"
                class="list-group-item list-group-item-action"
              >
                lorem
              </button>
              <button
                type="button"
                class="list-group-item list-group-item-action"
              >
                lorem
              </button>
              <button
                type="button"
                class="list-group-item list-group-item-action"
              >
                lorem
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
              <label class="btn btn-outline-primary" for="btnradio1">日</label>

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio2"
                autocomplete="off"
                value="month"
                v-model="spendingTrendRadio"
              />
              <label class="btn btn-outline-primary" for="btnradio2">月</label>

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio3"
                autocomplete="off"
                value="year"
                v-model="spendingTrendRadio"
              />
              <label class="btn btn-outline-primary" for="btnradio3">年</label>
            </div>
          </div>

          <div class="line-chart-container card-body" style="height: 300px">
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
              <PieChart :chart-data="barData" :chart-options="barOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PieChart from "@/components/PieChart.vue";
import { ref } from "vue";

const pieData = ref({
  labels: ["飲食", "投資", "助學金", "其他"],
  datasets: [
    {
      label: "支出",
      data: [2000, 2000, 25000, 125],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
      ],
    },
  ],
});

const pieOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      align: "cneter",
      labels: {
        boxWidth: 20,
        boxHeight: 10,
        padding: 20,
      },
    },
  },
});

const lineData = ref({
  labels: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
  ], // X 軸標籤，後端提供
  datasets: [
    {
      label: "支出", // 數據集標籤
      data: [65, 59, 80, 81, 56, 55, 100], // 數據點，後端提供
      backgroundColor: "rgba(75, 192, 192, 0.2)", // 填充顏色
      borderColor: "rgba(75, 192, 192, 1)", // 線條顏色
      borderWidth: 2, // 線條寬度
      tension: 0.2, // 曲線張力 (0 為直線)
    },
  ],
});

const lineOptions = ref({
  responsive: true, // 圖表是否響應式
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true, // Y 軸從 0 開始
    },
  },
});

const selectedDate = ref("default");

const spendingTrendRadio = ref("day");
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
