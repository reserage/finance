<template>
  <v-dialog v-model="isShowDialogForm" max-width="unset">
    <v-card>
      <v-card-title class="text-h6">新增記帳</v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-row align="center">
            <v-col cols="auto"
              ><v-radio-group inline v-model="form.isIncome">
                <v-radio label="支出" :value="false"></v-radio>
                <v-radio label="收入" :value="true"></v-radio> </v-radio-group
            ></v-col>
            <v-col
              ><v-select
                class=""
                label="選擇貨幣"
                :items="supportedCurrencies"
                v-model="form.currencyCode"
              ></v-select
            ></v-col>
          </v-row>

          <v-text-field
            v-model="form.amount"
            label="金額"
            type="number"
            required
          />
          <v-select
            v-model="form.category"
            label="類別"
            :items="
              props.allCategoriesData.filter((item) => item.isIncome === form.isIncome)
            "
            item-title="name"
            item-value="name"
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
import useExchangeRate from '@/composables/useExchangeRate';

const { supportedCurrencies, getExchangeRateByDate } = useExchangeRate();

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
  currencyCode: '新台幣(TWD)',
  rate: 1,
});

watch(
  () => form,
  async (newValue) => {
    console.log(newValue.value);
  },
  { deep: true }
);

//* 找到v-select選取的category所對應的Object
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

  const code = form.value.currencyCode?.match(/\((\w+)\)/)[1];

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
        currencyCode: code,
        rate:
          code === 'TWD'
            ? 1
            : (
                await getExchangeRateByDate('TWD', form.value.date)
              ).rates[code],
      },
      {
        withCredentials: true,
      }
    );
    // console.log("findTheCategoryObject: ", findTheCategoryObjecte);
    console.log('Response from API:', response.data);
    emit('fetchRecordsByBook');
  } catch (error) {
    if (
      error.response.data.message ===
        'No exchange rate found for the given date' &&
      error.response.status === 404
    ) {
      alert('該日期沒有匯率資料，請選擇其他日期');
    } else {
      alert('新增記帳失敗，請稍後再試');
    }
  }

  // 清空表單
  form.value = {
    isIncome: false,
    amount: null,
    category: '',
    note: '',
    date: new Date().toISOString().slice(0, 10),
    currencyCode: '新台幣(TWD)',
    rate: 1,
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
