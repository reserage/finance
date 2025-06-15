<template>
  <v-dialog v-model="isShowDialogForm" max-width="unset">
    <v-card>
      <v-card-title class="text-h6">新增記帳</v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-radio-group inline v-model="form.isIncome">
            <v-radio label="支出" value="expense"></v-radio>
            <v-radio label="收入" value="income"></v-radio>
          </v-radio-group>
          <v-text-field
            v-model="form.amount"
            label="金額"
            type="number"
            required
          />
          <v-select
            v-model="form.category"
            label="類別"
            :items="props.selectItems"
            required
          />
          <v-textarea v-model="form.note" label="備註" />
          <v-text-field v-model="form.date" label="日期" type="date" required />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isShowDialogForm = false">取消</v-btn>
        <v-btn color="primary" @click="submitForm">新增</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useTransactionStore } from "@/stores/useTransactionStore";
import axios from "axios";
import { defineModel, defineProps, defineEmits, watch, ref } from "vue";

const props = defineProps({
  selectItems: Array,
});

const emit = defineEmits(["fetchRecordsByBook"]);

const isShowDialogForm = defineModel();

const TransactionStore = useTransactionStore();
const form = ref({
  isIncome: "expense",
  amount: null,
  category: "",
  note: "",
  date: new Date().toISOString().slice(0, 10),
});

watch(
  () => form,
  (newValue) => {
    console.log(newValue);
  },
  { deep: true }
);

const submitForm = async () => {
  if (
    form.value.amount === null ||
    form.value.amount === 0 ||
    form.value.category === ""
  ) {
    alert("金錢和類別是必填項目");
    return;
  }
  // 送出資料邏輯，例如呼叫 API 儲存
  console.log("送出表單: ", form.value);

  // 關閉 dialog
  isShowDialogForm.value = false;
  try {
    const response = await axios.post(
      "http://localhost:5000/test/addRecordByBook",
      {
        category: form.value.category,
        amount: form.value.amount,
        note: form.value.note,
        date: form.value.date,
        isIncome: form.value.isIncome,
        bookId: TransactionStore.selectedBook,
      },
      {
        withCredentials: true,
      }
    );
    console.log("savedRecordId: ", response.data.savedRecordId);
    console.log("response.data.updatedBook: ", response.data.updatedBook);
    emit("fetchRecordsByBook");
  } catch (error) {
    console.log("Error submitting form:", error);
  }

  // 清空表單
  form.value = {
    isIncome: "expense",
    amount: null,
    category: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  };

  // 你也可以 refresh 記帳資料
};
</script>

<style scoped>
.v-dialog {
  width: unset;
}

@media (min-width: 600px) {
  .v-dialog {
    width: 60%;
  }
}
</style>
