// src/composables/useAmountFilter.js
import { ref } from 'vue';
import debounce from 'lodash/debounce';

export default function useAmountFilter(
  records,
  selectValue,
  selectExpenseOrIncome,
  filteredRecords
) {
  const maxAmount = ref();
  const minAmount = ref();
  const maxAmountError = ref(false);
  const minAmountError = ref(false);
  const maxAmountErrorMessage = ref('');
  const minAmountErrorMessage = ref('');

  const errorMessage = ['最低金額不能超過最高金額'];

  const handleAmountChangeAndCategoryChange = debounce(
    (newMax, newMin, oldMax, oldMin) => {
      const min = newMin === '' ? NaN : Number(newMin);
      const max = newMax === '' ? NaN : Number(newMax);

      // reset
      minAmountError.value = false;
      maxAmountError.value = false;
      minAmountErrorMessage.value = '';
      maxAmountErrorMessage.value = '';

      let filterFn;
      if (!isNaN(min) && !isNaN(max)) {
        if (min > max) {
          if (max === Number(oldMax)) {
            minAmountError.value = true;
            minAmountErrorMessage.value = errorMessage[0];
          } else if (min === Number(oldMin)) {
            maxAmountError.value = true;
            maxAmountErrorMessage.value = errorMessage[0];
          }
          return;
        }
        filterFn = (record) =>
          record.amount >= min &&
          record.amount <= max &&
          (selectValue.value.length === 0 ||
            selectValue.value.includes(record.category)) &&
          selectExpenseOrIncome.value === record.isIncome;
      } else if (!isNaN(min)) {
        filterFn = (record) =>
          record.amount >= min &&
          (selectValue.value.length === 0 ||
            selectValue.value.includes(record.category)) &&
          selectExpenseOrIncome.value === record.isIncome;
      } else if (!isNaN(max)) {
        filterFn = (record) =>
          record.amount <= max &&
          (selectValue.value.length === 0 ||
            selectValue.value.includes(record.category)) &&
          selectExpenseOrIncome.value === record.isIncome;
      } else {
        filterFn = (record) =>
          true &&
          (selectValue.value.length === 0 ||
            selectValue.value.includes(record.category)) &&
          selectExpenseOrIncome.value === record.isIncome;
      }

      filteredRecords.value =
        records.value.filter(filterFn);
    },
    500
  );

  return {
    maxAmount,
    minAmount,
    maxAmountError,
    minAmountErrorMessage,
    minAmountError,
    maxAmountErrorMessage,
    handleAmountChangeAndCategoryChange,
  };
}
