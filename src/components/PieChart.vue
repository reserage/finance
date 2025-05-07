<!-- 使用這個組件要傳入 chartData 和 chartOptions 兩個 props。 -->

<!-- chatData 格式:
{
labels: labels, // 定義圖表中每個數據類別的名稱（通常是 X 軸的標籤）
    datasets: [
      {
        label: "支出",
        data: data.length > 0 ? data : [0], // 定義每個類別的實際數值（通常是 Y 軸的值或圓餅圖的扇形大小）
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
        ],
      },
    ],
};
-->

<!-- chartOptions 格式:
 {
  responsive: true,
  maintainAspectRatio: false, // 是否保持圖表的長寬比
  .....
});
-->

<!-- PieChart.vue -->
<template>
  <div class="chart-container">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, onBeforeMount } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    default: () => ({}),
  },
  chartType: {
    type: String,
    default: "pie",
  },
});

const chartInstance = ref(null);
const chart = ref(null);
const isDestroyed = ref(false);

onBeforeMount(() => {
  isDestroyed.value = false;
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

onMounted(() => {
  renderChart();
});

const renderChart = () => {
  console.log("renderChart() 被呼叫了");
  if (isDestroyed.value) {
    console.error("Chart 實例已被銷毀，無法重新渲染。");
    return;
  }

  if (!chart.value) {
    console.error("Canvas 元素未正確掛載");
    return;
  }

  const ctx = chart.value.getContext("2d");
  if (!ctx) {
    console.error("Canvas 上下文獲取失敗");
    return;
  }

  // 銷毀舊圖表實例
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  chartInstance.value = new Chart(ctx, {
    type: props.chartType,
    data: props.chartData,
    options: props.chartOptions,
  });
  console.log("renderChart() 結束，圖表實例已建立。");
};

const updateChart = () => {
  if (isDestroyed.value) return;

  if (chartInstance.value && chart.value) {
    // 先销毁再重新渲染
    chartInstance.value.destroy();
    renderChart();
  }
};

// 修改監聽邏輯，使用 nextTick
import { nextTick } from "vue";

watch(
  () => props.chartData,
  async () => {
    await nextTick(); // 等待 DOM 更新完成
    if (isDestroyed.value) return;

    if (!chart.value || !document.body.contains(chart.value)) return;

    if (!chartInstance.value) {
      renderChart();
    } else {
      updateChart(); // 直接調用更新邏輯
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
