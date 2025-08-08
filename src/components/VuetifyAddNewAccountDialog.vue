<template>
  <v-dialog v-model="isShowDialogForm" max-width="unset">
    <v-card>
      <v-card-title class="text-h6">新增記帳</v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-radio-group inline v-model="form.isIncome">
            <v-radio label="支出" :value="false"></v-radio>
            <v-radio label="收入" :value="true"></v-radio>
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
          <v-text-field
            v-model="form.date"
            label="日期"
            type="date"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isShowDialogForm = false"
          >取消</v-btn
        >
        <v-btn color="primary" @click="submitForm"
          >新增</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useTransactionStore } from '@/stores/useTransactionStore';
import axios from 'axios';
import {
  defineModel,
  defineProps,
  defineEmits,
  watch,
  ref,
  computed,
} from 'vue';

const props = defineProps({
  selectItems: Array,
  allCategoriesData: Array,
});

const emit = defineEmits(['fetchRecordsByBook']);

const isShowDialogForm = defineModel();

const TransactionStore = useTransactionStore();
const form = ref({
  isIncome: false,
  amount: null,
  category: '',
  note: '',
  date: new Date().toISOString().slice(0, 10),
});

watch(
  () => form,
  (newValue) => {
    console.log(newValue);
  },
  { deep: true }
);

// 找到v-select選取的category所對應的Object
const findTheCategoryObjecte = computed(() => {
  return props.allCategoriesData.find(
    (item) => item.name === form.value.category
  );
});

const submitForm = async () => {
  if (
    form.value.amount === null ||
    form.value.amount === 0 ||
    form.value.category === ''
  ) {
    alert('金錢和類別是必填項目');
    return;
  }
  // 送出資料邏輯，例如呼叫 API 儲存
  console.log('送出表單: ', form.value);

  // 關閉 dialog
  isShowDialogForm.value = false;
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_BACKEND_API_URL}/test/addRecordByBook`,
      {
        category: form.value.category,
        amount: form.value.amount,
        note: form.value.note,
        date: form.value.date,
        isIncome: form.value.isIncome,
        bookId: TransactionStore.selectedBook,
        categoryId: findTheCategoryObjecte.value._id,
      },
      {
        withCredentials: true,
      }
    );
    console.log(
      'savedRecordId: ',
      response.data.savedRecordId
    );
    console.log(
      'response.data.updatedBook: ',
      response.data.updatedBook
    );
    // console.log("findTheCategoryObject: ", findTheCategoryObjecte);
    emit('fetchRecordsByBook');
  } catch (error) {
    console.log('Error submitting form:', error);
  }

  // 清空表單
  form.value = {
    isIncome: false,
    amount: null,
    category: '',
    note: '',
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
