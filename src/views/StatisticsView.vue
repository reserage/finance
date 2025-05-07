<template>
  <div class="container mt-5">
    <div class="form-group">
      <label class="form-label" for="selectedDate">選擇日期</label>
      <select class="form-select" id="selectedDate" v-model="selectedDate">
        <!-- 預計由後端提供 option 的值，後端給出有資料的月份，無資料的月份就不提供-->
        <option selected value="default">下拉選擇日期</option>
      </select>
    </div>
  </div>

  <div class="container">
    <div class="grid-container">
      <div class="summary bg-light mt-5 p-3 border rounded text-center">
        <div class="d-flex justify-content-evenly">
          <div class="expendtiure">
            <h2>本月收入</h2>
            <h3>$25000</h3>
            <!--金錢由後端提供-->
          </div>
          <div class="line border"></div>
          <div class="income">
            <h2>本月支出</h2>
            <h3>$19000</h3>
            <!--金錢由後端提供-->
          </div>
        </div>
      </div>
      <div
        class="outsidePieChartContainer bg-light border rounded d-flex flex-column justify-content-center align-items-center mt-5 p-3"
      >
        <h2>支出分類比例</h2>
        <div class="pie-chart-container">
          <PieChart :chart-data="pieData" :chart-options="pieOptions" />
        </div>
      </div>

      <div class="lineChart card bg-light p-3">
        <h2 class="card-title">支出趨勢</h2>
        <div class="line-chart-container card-body">
          <PieChart
            :chart-data="lineData"
            :chart-options="lineOptions"
            chart-type="line"
          />
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
</script>

<style scoped>
.outsidePieChartContainer {
  grid-area: pie;
}

.pie-chart-container {
  width: 90%;
}

.grid-container {
  height: 80vh;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 1rem;
  grid-template-areas:
    "sum sum sum sum  . pie pie pie"
    "lin lin lin lin  lin pie pie pie"
    "lin lin lin lin  lin pie pie pie"
    "lin lin lin lin  lin pie pie pie"
    "lin lin lin lin  lin . . ."
    ". . . . . . . ."
    ". . . . . . . ."
    ". . . . . . . .";
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
</style>
