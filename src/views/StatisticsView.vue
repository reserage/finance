<template>
  <div class="container mt-5">
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
      </div>

      <!-- 餅圖區塊 -->
      <div class="col-12 col-lg-4 mb-4">
        <div class="outsidePieChartContainer bg-light border rounded d-flex flex-column justify-content-center align-items-center p-3 h-100">
          <h2>支出分類比例</h2>
          <div class="pie-chart-container w-100" style="height: 300px;">
            <PieChart :chart-data="pieData" :chart-options="pieOptions" />
          </div>
        </div>
      </div>

      <!-- 折線圖區塊 -->
      <div class="col-12 mb-4">
        <div class="lineChart card bg-light p-3">
          <h2 class="card-title">支出趨勢</h2>
          <div class="line-chart-container card-body" style="height: 300px;">
            <PieChart
              :chart-data="lineData"
              :chart-options="lineOptions"
              chart-type="line"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 保持原有的 script 部分不變
</script>

<style scoped>
/* 移除原有的 grid-container 相關樣式 */

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
</style>