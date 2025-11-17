<template>
  <v-dialog
    v-model="isShowDialog"
    scrollable
    :overlay="false"
    max-width="unset"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-media src="src" height="200px"> </v-card-media>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">預算設定</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- 每個類別的Card可以設定預算 -->
        <v-card
          v-for="(category, index) in categoriesWithRatioAndColorProperty"
          :key="index"
          class="mb-4"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="fs-3">{{ category.name }}</span>
            <v-chip :color="category.color" class="fs-5"
              >{{
                Number.isInteger(category.total)
                  ? category.total
                  : category.total.toFixed(2)
              }}/{{ category.budget }}
            </v-chip>
          </v-card-title>

          <v-card-text class="py-2">
            <v-progress-linear
              height="20px"
              rounded="true"
              :model-value="category.budget == 0 ? 0 : category.ratio"
              striped
              :color="category.color"
            >
              <span v-if="category.budget == 0" style="color: black"
                >未設定預算</span
              >
            </v-progress-linear>
          </v-card-text>

          <v-card-actions>
            <v-btn
              text
              class="fs-5"
              @click.prevent="
                openSettingBudgetDialog(category.budget, category._id)
              "
              >編輯預算</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="primary" class="fs-6" @click.prevent="emit('close')"
          >關閉</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isEditingBudgetDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">設定預算</v-card-title>
      <v-card-text>
        <v-text-field v-model="setNewBudget" label="設定預算" type="number" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isEditingBudgetDialog = false">取消</v-btn>
        <v-btn text color="primary" @click="saveBudgetInDB()">確認</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-overlay :model-value="loading" opacity="0.6">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
</template>
<script setup>
import {
  ref,
  defineModel,
  defineEmits,
  watch,
  defineProps,
  computed,
} from 'vue';
import axios from 'axios';
import { useTransactionStore } from '@/stores/useTransactionStore';
import { useLoading } from '@/composables/useLoading';
const { loading, wrap } = useLoading();
const TransactionStore = useTransactionStore();

const props = defineProps(['allCategoriesData']);
console.log('props.allca', props.allCategoriesData);

const emit = defineEmits(['close']);

const isShowDialog = defineModel();

const isEditingBudgetDialog = ref(false);

const setNewBudget = ref(0);

// categoriesWithRatioAndColorProperty
// {
// date: "2025-04-30T16:00:00.000Z",
// isIncome: false,
// name: "交通",
// user: "6815c5bd9bc92882cefd2306",
// __v: 0,
// _id: "6815c5bd9bc92882cefd230b",
// budget: 3000,
// ratio: 67,
// color: 'orange'
// } 加工後的格式

// 如果ratio為-1，會顯示未設定預算
const categoriesWithRatioAndColorProperty = computed(() => {
  return (
    props.allCategoriesData?.map((category) => {
      const id = category._id;

      const ratioMap =
        backendRatioAndBudgetAndTotal.value?.ratiosByCategory || {};
      const budgetMap = backendRatioAndBudgetAndTotal.value?.budget || {};
      const totalMap =
        backendRatioAndBudgetAndTotal.value?.totalsByCategory || {};

      const budget = budgetMap[id] === undefined ? 0 : budgetMap[id];
      const total = totalMap[id] === undefined ? 0 : totalMap[id];
      const ratio = (() => {
        if (ratioMap[id] !== undefined) {
          return ratioMap[id];
        } else if (budget > 0) {
          return 0;
        }
      })();
      const color = getCategoryStatusColor(total, budget);

      return {
        ...category,
        budget,
        total,
        ratio,
        color,
      };
    }) || []
  );
});

watch(categoriesWithRatioAndColorProperty, (newValue) => {
  console.log('categoriesWithRatioAndColorProperty變化了', newValue);
});

// 當該Dialog開啟時使用
const backendRatioAndBudgetAndTotal = ref({});
watch(isShowDialog, async (newValue) => {
  if (newValue === true) {
    getBudgetFromBackend();
  }
});

function getCategoryStatusColor(total, budget) {
  console.log('計算顏色', total, budget);
  const ratio = total / budget;
  console.log('計算比例', ratio);
  if (isNaN(ratio)) return '';
  if (ratio <= 0.5 || isNaN(ratio) || ratio === Infinity) return 'green';
  else if (ratio <= 0.75) return 'orange';
  else return 'red';
}

const currentEditingCategoryId = ref(null);
function openSettingBudgetDialog(currentBudget, categoryId) {
  isEditingBudgetDialog.value = true;
  setNewBudget.value = currentBudget;
  currentEditingCategoryId.value = categoryId;
}

//* 將設定的預算儲存在資料庫中
async function saveBudgetInDB() {
  if (!currentEditingCategoryId.value) {
    isEditingBudgetDialog.value = false;
    return;
  }
  await wrap(async () => {
    try {
      const res = await axios.post(
        `${process.env.VUE_APP_BACKEND_API_URL}/budget/category`,
        {
          bookId: TransactionStore.selectedBook,
          categoryId: currentEditingCategoryId.value,
          amount: Number(setNewBudget.value),
        },
        {
          withCredentials: true,
        }
      );
      console.log('儲存預算成功', res.data);
    } catch (e) {
      console.error('儲存預算時發生錯誤', e);
      return;
    } finally {
      await getBudgetFromBackend();
      isEditingBudgetDialog.value = false;
    }
  });
}

async function getBudgetFromBackend() {
  await wrap(async () => {
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_BACKEND_API_URL}/budget/category`,
        {
          params: {
            bookId: TransactionStore.selectedBook,
          },
          withCredentials: true,
        }
      );
      console.log('從後端取得的預算資料', res.data);
      backendRatioAndBudgetAndTotal.value = res.data;
    } catch (e) {
      console.error('從後端取得預算資料時發生錯誤', e);
    }
  });
}
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
