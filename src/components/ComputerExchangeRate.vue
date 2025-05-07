<script setup>


</script>

<template>
  <div class="exchange-rate">
    <p v-if="loading">載入中...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <table v-if="!loading && !error">
      <thead>
        <tr>
          <th>貨幣</th>
          <th>匯率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rate, currency) in exchangeRates" :key="currency">
          <td>{{ currency }} ({{ currencyNames[currency] }})</td>
          <td>{{ rate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.exchange-rate {
  /* max-width: 400px; */
  /* margin: auto; */
  width: 100%;
  text-align: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}
.error {
  color: red;
}
</style>