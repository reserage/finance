<template>
  <!-- {{ recordsByDate }} -->
  <v-card
    elevation="12"
    class="my-3"
    v-for="(records, index) in recordsByDate"
    :key="index"
  >
    <v-card-title class="d-flex justify-center"></v-card-title>
    <v-list lines="one">
      <v-list-subheader>{{ records[0].slice(5) }}</v-list-subheader>

      <template v-for="(record, index) in records[1]" :key="index">
        <v-list-item ripple="true" @click.prevent="">
          <template v-slot:prepend>
            <v-avatar color="grey-darken-1"
              ><v-icon>mdi-silverware-fork-knife</v-icon></v-avatar
            >
          </template>

          <v-list-item-title
            class="d-flex justify-space-between"
            :title="`Message ${n}`"
            ><div class="category">{{ record.category }}</div>
            <div class="note">{{ record.note || "沒有備註" }}</div>
            <div class="amount">{{ record.amount }}</div></v-list-item-title
          >

          <v-list-item-subtitle
            title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil repellendus distinctio similique"
          ></v-list-item-subtitle>
        </v-list-item>

        <v-divider v-if="n !== 6" :key="`divider-${n}`" inset></v-divider>
      </template>
    </v-list>
  </v-card>
</template>
<script setup>
import { useTransactionStore } from "@/stores/useTransactionStore";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
const records = ref([]); // 從後端獲取的記帳資料

const cleanupController = new AbortController();
const fetchDataByBook = async (bookId) => {
  const response = await axios.get(
    "http://localhost:5000/test/getRecordsByBook",
    {
      params: { bookId },
      withCredentials: true,
      signal: cleanupController.signal,
    }
  );
  // date.value裡面存放日期

  records.value = response.data.records;

  console.log("response.data: ", response.data);
  console.log("records.value: ", records.value);
};

// recordsByDate格式為: [[日期1, [該日期記帳資料1, 記帳資料2, ...]], [日期2, [該日期記帳資料1, 記帳資料2, ...]], ...]
const recordsByDate = computed(() => {
  const grouped = {};

  records.value.forEach((record) => {
    console.log("recordsByDate record: ", record);
    const dateOnly = record.date.slice(0, 10); // 取出 YYYY-MM-DD
    if (!grouped[dateOnly]) {
      grouped[dateOnly] = [];
    }
    grouped[dateOnly].push(record);
  });

  // 轉成陣列並依日期排序（新到舊）
  const result = Object.entries(grouped).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  ); // 依日期降冪排序

  return result;
});

const TransactionStore = useTransactionStore();
onMounted(() => {
  fetchDataByBook(TransactionStore.selectedBook);
});
</script>
