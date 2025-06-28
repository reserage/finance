<template>
  <!-- 選擇選分下拉選單 -->
  <v-autocomplete
    v-model="year"
    :items="years"
    label="選擇年份"
  ></v-autocomplete>

  <!-- 所有記帳本 -->
  <v-row>
    <v-col
      class=""
      cols="12"
      sm="6"
      md="4"
      v-for="(card, index) in bookInfo"
      :key="index"
    >
      <v-card class="responsive-card" ripple @click="handleClick(card._id)">
        <v-card-title class="fs-2">
          <v-icon class="mr-2" color="primary">mdi-book</v-icon
          >{{ card.name }}</v-card-title
        >
        <v-card-text class="fs-6">
          {{ card.description }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- 修改或新增記帳本按鈕 -->
  <v-row
    ><v-col cols="12" class="d-flex justify-center"
      ><v-btn
        prepend-icon="mdi-plus"
        class="w-75"
        size="large"
        @click="tempName"
      >
        修改或新增記帳本
      </v-btn></v-col
    ></v-row
  >
</template>
<script setup>
import router from "@/router";
import { useTransactionStore } from "@/stores/useTransactionStore";
import axios from "axios";
import { onMounted, ref, watch } from "vue";

const bookInfo = ref([
  {
    name: "1月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "2月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "3月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "4月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "5月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
    bookId: "6839eed7337b98e646e81d1a",
  },
  {
    name: "6月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "7月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "8月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "9月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "10月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "11月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
  {
    name: "12月記帳本",
    description: "這是一個範例視圖，您可以在此處添加任何內容。",
  },
]);
console.log(bookInfo.value);

// 真正的年份數據應該從後端獲取，這裡僅作為範例
const years = ["2020", "2021", "2022", "2023", "2024", "2025"];
const year = ref("2025");

const TransactionStore = useTransactionStore();
function handleClick(bookId) {
  TransactionStore.setSelectedBook(bookId);
  console.log(TransactionStore.selectedBook);
  router.push("/bookKeeping");
}

async function getBook() {
  try {
    const response = await axios.get(
      "http://localhost:5000/bookKeeping/getbookKeepings",
      {
        params: { year: year.value },
        withCredentials: true,
      }
    );
    console.log("response.data", response.data);

    bookInfo.value = response.data.gotBookKeeping;
    console.log("更新後的bookInfo: ", bookInfo.value);
  } catch (e) {
    if (e.status == 401) {
      alert(e.response.data.message);
      router.push("/auth/login");
    }
  }
}
onMounted(() => {
  getBook();
});

watch(year, (newValue) => {
  getBook(newValue);
  console.log(newValue);
});

const tempName = () => {
  alert("功能還未做");
};

// // 在這裡測試實際不是這樣的
// const name = "測試記帳本";
// const date = `${year.value}-01-01`;
// const description = "測試描述符1";
// async function handleChange() {
//   try {
//     const response = await axios.post(
//       "http://localhost:5000/bookKeeping/create",
//       {
//         name,
//         description,
//         date,
//       },
//       {
//         withCredentials: true,
//       }
//     );

//     console.log(response);
//   } catch (e) {
//     if (e.status === 401) {
//       alert(e.response.data.message);
//       router.push("/auth/login");
//       return;
//     } else {
//       console.error("發生錯誤:", e);
//     }
//   }
// }
</script>

<style scoped>
.responsive-card {
  min-height: 160px;
}

@media (min-width: 600px) {
  /* 平板以上 */
  .responsive-card {
    min-height: 200px;
  }
}

@media (min-width: 960px) {
  /* 桌機以上 */
  .responsive-card {
    min-height: 240px;
  }
}
</style>
