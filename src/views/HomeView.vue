<!-- App.vue -->
<template>
  <main class="container d-flex flex-column justify-content-start">
    <div id="chart-contaner">
      <PieChart
        v-show="isDesktop"
        :chart-data="chartData"
        :chart-options="chartOptions"
      />
      <div class="container-incomeAndExpenditure gap-2 align-items-start">
        <div class="income">收入: {{ monthlyIncome }}</div>
        <div class="expenditure">支出: {{ monthlyExpenditure }}</div>
      </div>
    </div>

    <div class="button-container">
      <div class="selectedContainer">
        <select
          name=""
          id="chartCategory"
          class="form-select"
          v-model="selectedChartCategory"
        >
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
      </div>

      <ComputerRecordModal v-if="isDesktop" @modalData="handleModalData" />
    </div>

    <div class="appRecordContainer">
      <ComputerAccountingRecords v-if="isDesktop">
        <RecordItem
          v-for="recordObj in recordItemArry.filter(
            (item) => item.isIncome === selectedChartCategory
          )"
          :key="recordObj.id"
          :item-information="recordObj"
          @delete-item="handleDeleteItem"
        />
      </ComputerAccountingRecords>
    </div>

    <!-- <div class="exchangeContainer">
        <ComputerExchangeRate />
      </div> -->
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import PieChart from "../components/PieChart.vue";
import ComputerAccountingRecords from "../components/ComputerAccountingRecords.vue";
import RecordItem from "../components/RecordItem.vue";
import ComputerRecordModal from "../components/ComputerRecordModal.vue";
import axios from "axios";
// import ComputerExchangeRate from "./components/ComputerExchangeRate.vue";

// 響應式數據
const isDesktop = ref(window.innerWidth >= 768);

// 關於記帳的資料(要給後端)
let recordItemArry = ref([
  {
    id: 1,
    category: "飲食",
    amount: 2000,
    note: "這裡是備註",
    date: "2025-03-25",
    isIncome: "expense",
  },
  {
    id: 2,
    category: "投資",
    amount: 2000,
    note: "這裡是備註",
    date: "2025-03-25",
    isIncome: "income",
  },
  {
    id: 3,
    category: "飲食",
    amount: 70,
    note: "",
    date: "2025-03-25",
    isIncome: "expense",
  },
  {
    id: 4,
    category: "飲食",
    amount: 125,
    note: "",
    date: "2025-03-25",
    isIncome: "expense",
  },
  {
    id: 5,
    category: "助學金",
    amount: 25000,
    note: "金融服務",
    date: "2025-03-25",
    isIncome: "income",
  },
  {
    id: 6,
    category: "飲食",
    amount: 89,
    note: "",
    date: "2025-03-27",
    isIncome: "expense",
  },
  {
    id: 7,
    category: "飲食",
    amount: 85,
    note: "",
    date: "2025-03-27",
    isIncome: "expense",
  },
  {
    id: 8,
    category: "零食",
    amount: 166,
    note: "洋芋片+泡麵",
    date: "2025-03-30",
    isIncome: "expense",
  },
  {
    id: 9,
    category: "飲食",
    amount: 128,
    note: "",
    date: "2025-03-30",
    isIncome: "expense",
  },
  {
    id: 10,
    category: "生活",
    amount: 99,
    note: "",
    date: "2025-03-30",
    isIncome: "expense",
  },
]);

function fetchData() {
  console.log("執行fetchData()");

  return axios
    .get("http://localhost:5000/test/getRecords", {
      withCredentials: true,
    })
    .then((res) => {
      recordItemArry.value = res.data.records.map((item) => {
        return {
          id: item._id,
          category: item.category,
          amount: item.amount,
          note: item.note,
          date: new Date(item.date).toISOString().split("T")[0],
          isIncome: item.isIncome,
        };
      });

      console.log("從後端取得的資料res.data.records", res.data.records);
      // console.log("recordItemArry", recordItemArry.value);
      // console.log("typeof recordItemArry", typeof recordItemArry.value);
      console.log("fetch()結束");
    })
    .catch((err) => {
      console.log("獲取資料失敗", err);
      throw err;
    });
}

// 放置支出的類別及金額的物件
const expenseCategoryTotals = computed(() => {
  return recordItemArry.value
    .filter((item) => item.isIncome === "expense")
    .reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.amount;
      return acc;
    }, {});
});

const incomeCategoryTotals = computed(() => {
  return recordItemArry.value
    .filter((item) => item.isIncome === "income")
    .reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.amount;
      return acc;
    }, {});
});

fetchData();

// 動態生成 chartData
const chartData = computed(() => {
  console.log("變更一次chartData");

  const totals =
    selectedChartCategory.value === "expense"
      ? expenseCategoryTotals.value
      : incomeCategoryTotals.value;

  console.log("totals(動態變更chartData中)", totals);

  const labels = Object.keys(totals);
  const data = Object.values(totals);
  console.log("chartData變動結束");
  return {
    labels: labels,
    datasets: [
      {
        label: "支出",
        data: data.length > 0 ? data : [0], // 避免空數據
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
        ],
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// 紀錄這個月總收入、支出
const monthlyIncome = computed(() => {
  return recordItemArry.value
    .filter((item) => item.isIncome === "income")
    .map((item) => item.amount)
    .reduce((sum, amount) => sum + amount, 0);
});
const monthlyExpenditure = computed(() => {
  return recordItemArry.value
    .filter((item) => item.isIncome === "expense")
    .map((item) => item.amount)
    .reduce((sum, amount) => sum + amount, 0);
});

// 綁定下拉選擇的值
const selectedChartCategory = ref("expense");

async function handleModalData() {
  await fetchData(); // 更新畫面
}

// 刪除指定的記帳項目
const handleDeleteItem = async (id) => {
  console.log("handleDeleteItem()執行");
  console.log("刪除的項目ID:", id);
  try {
    await axios.delete(`http://localhost:5000/test/deleteRecord/${id}`, {
      withCredentials: true,
    });
    console.log("刪除成功");
    await fetchData(); // 重新獲取資料以更新畫面
    console.log("handleDeleteItem()結束");
  } catch (err) {
    console.log("刪除失敗", err);
  }
};

// 事件處理
const handleResize = () => {
  isDesktop.value = window.innerWidth >= 768;
};

// 生命周期
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// --------------------------------- 匯率部分
// const exchangeRates = ref({});
// const loading = ref(true);
// const error = ref(null);

// 添加中文货币名映射
// const currencyNames = {
//   USD: "美元",
//   EUR: "歐元",
//   JPY: "日圓",
//   CNY: "人民幣",
//   HKD: "港幣",
// };

// onMounted(async () => {
//   try {
//     const response = await fetch("https://api.exchangerate-api.com/v4/latest/TWD");
//     if (!response.ok) {
//       throw new Error("無法取得匯率資料");
//     }
//     const data = await response.json();
//     exchangeRates.value = {
//       USD: data.rates.USD,
//       EUR: data.rates.EUR,
//       JPY: data.rates.JPY,
//       CNY: data.rates.CNY,
//       HKD: data.rates.HKD,
//     };
//   } catch (err) {
//     error.value = err.message;
//   } finally {
//     loading.value = false;
//   }
// });

console.log("test");

axios
  .get("http://localhost:5000/auth/checkLogin", { withCredentials: true })
  .then((response) => {
    console.log("登入成功", response.data);
  })
  .catch((error) => {
    if (error.response && error.response.status === 401) {
      console.log("未登入，導向登入頁面");
      window.location.href = "/auth/login";
    } else {
      console.log("發生錯誤", error);
    }
  });
</script>

<style scoped>
main {
  position: relative;
}

#chart-contaner {
  display: inline-block;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 2rem;
  position: relative;
  height: 40vh;
}

.container-incomeAndExpenditure {
  position: absolute;
  bottom: 5%;
  left: 5%;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
}

.button-container {
  max-width: 70vw;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.appRecordContainer {
  padding: 1rem;
  overflow: auto;
  max-height: 40vh;
}

h1 {
  margin-bottom: 0.3rem;
  font-size: 1.7rem;
}

.exchangeContainer {
  position: absolute;
  width: 30%;
  display: inline-block;
  top: 0;
  right: 0;
}
</style>
