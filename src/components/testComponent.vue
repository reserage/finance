<template>
    <div class="dashboard">
      <h2>財務統計總覽</h2>
  
      <!-- 月收入與支出 -->
      <div class="summary">
        <div>本月收入：{{ totalIncome }}</div>
        <div>本月支出：{{ totalExpense }}</div>
      </div>
  
      <!-- 支出比例 -->
      <canvas ref="categoryChart" />
  
      <!-- 收支趨勢 -->
      <canvas ref="trendChart" />
  
      <!-- 預算對比 -->
      <canvas ref="budgetChart" />
  
      <!-- Top 消費分類 -->
      <div class="top-spending">
        <h3>高消費類別 Top 5</h3>
        <ol>
          <li v-for="item in topSpending" :key="item.category">
            {{ item.category }}：${{ item.amount }}
          </li>
        </ol>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)
  
  const totalIncome = 28000
  const totalExpense = 21500
  
  const topSpending = [
    { category: '餐飲', amount: 8000 },
    { category: '娛樂', amount: 4500 },
    { category: '交通', amount: 3200 },
    { category: '購物', amount: 2700 },
    { category: '旅遊', amount: 1800 },
  ]
  
  // refs
  const categoryChart = ref(null)
  const trendChart = ref(null)
  const budgetChart = ref(null)
  
  onMounted(() => {
    // 支出分類圓餅圖
    new Chart(categoryChart.value, {
      type: 'pie',
      data: {
        labels: ['餐飲', '交通', '娛樂', '購物', '旅遊'],
        datasets: [{
          data: [8000, 3200, 4500, 2700, 1800],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9CCC65', '#FFA726']
        }]
      }
    })
  
    // 收支趨勢折線圖
    new Chart(trendChart.value, {
      type: 'line',
      data: {
        labels: ['4/1', '4/5', '4/10', '4/15', '4/20', '4/25', '4/30'],
        datasets: [
          {
            label: '收入',
            data: [3000, 4000, 2000, 5000, 3500, 4500, 3000],
            borderColor: '#4CAF50',
            fill: false
          },
          {
            label: '支出',
            data: [2000, 2500, 3000, 4000, 1500, 3800, 2700],
            borderColor: '#F44336',
            fill: false
          }
        ]
      }
    })
  
    // 預算對比柱狀圖
    new Chart(budgetChart.value, {
      type: 'bar',
      data: {
        labels: ['餐飲', '娛樂', '交通', '購物', '旅遊'],
        datasets: [
          {
            label: '預算',
            data: [7000, 4000, 3000, 3000, 1500],
            backgroundColor: '#90CAF9'
          },
          {
            label: '實際支出',
            data: [8000, 4500, 3200, 2700, 1800],
            backgroundColor: '#F48FB1'
          }
        ]
      }
    })
  })
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 900px;
    margin: auto;
    display: grid;
    gap: 2rem;
    padding: 1rem;
  }
  
  .summary {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .top-spending ol {
    padding-left: 1.2rem;
  }
  </style>
  