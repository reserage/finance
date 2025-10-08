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
import { ref, watch, onMounted, defineProps, onBeforeUnmount } from "vue";
import { Chart, registerables } from "chart.js";
import { nextTick } from "vue";
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

let chartInstance = null;
const chart = ref(null);
const isMounted = ref(false);
const pendingRender = ref(false);

// const isDestroyed = ref(false);

// onBeforeMount(() => {
//   // isDestroyed.value = false;
//   if (chartInstance.value) {
//     chartInstance.value.destroy();
//     chartInstance.value = null;
//   }
// });
///

onMounted(async () => {
  console.log("chart.value", chart.value);

  await nextTick();
  isMounted.value = true;
  safeRender();
});
///
onBeforeUnmount(() => {
  isMounted.value = false;
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

// 安全渲染函数
const safeRender = async () => {
  console.log(`刷新 ${chart.value} 圖形`);

  if (!isMounted.value || pendingRender.value) return;

  pendingRender.value = true;
  requestAnimationFrame(async () => {
    try {
      if (!chart.value || !document.body.contains(chart.value)) {
        throw new Error("Canvas element not in DOM");
      }

      // 等待瀏覽器完成銷毀

      setTimeout(() => {
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }

        const ctx = chart.value.getContext("2d");
        chartInstance = new Chart(ctx, {
          type: props.chartType,
          data: props.chartData,
          options: props.chartOptions,
        });
      }, 20);
    } catch (error) {
      console.warn("Chart render aborted:", error.message);
    } finally {
      pendingRender.value = false;
    }
  });
};

// const updateChart = () => {
//   if (!chart.value || !chart.value.parentNode) {
//     console.error("Canvas 元素未正確掛載或已被移除，無法更新圖表");
//     return;
//   }

//   if (chartInstance.value) {
//     chartInstance.value.destroy();
//     renderChart();
//   }
// };

// 修改監聽邏輯，使用 nextTick

watch(
  () => props.chartData,
  () => {
    nextTick(safeRender);
  },
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
