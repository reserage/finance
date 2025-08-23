<template>
  <!-- {{ recordsByDate }} -->
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>篩選記帳</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row
          ><v-radio-group inline v-model="selectExpenseOrIncome">
            <v-radio label="支出" value="expense"></v-radio>
            <v-radio label="收入" value="income"></v-radio> </v-radio-group
        ></v-row>
        <v-row
          ><v-col cols="12" sm="6"
            ><v-select
              v-model="selectValue"
              clearable
              label="選擇類別"
              :items="selectItems"
              multiple
            >
              <template v-slot:selection="{ item, index }">
                <v-chip
                  v-if="index < 2"
                  :text="item.title"
                  class="fs-5 mt-3"
                ></v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center fs-6 mt-3"
                >
                  (+{{ selectValue.length - 2 }} others)</span
                >
              </template>
            </v-select></v-col
          >

          <v-col cols="12" sm="3">
            <v-text-field
              label="最低金額"
              type="number"
              v-model="minAmount"
              :error="minAmountError"
              :error-messages="minAmountErrorMessage"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              label="最高金額"
              type="number"
              v-model="maxAmount"
              :error="maxAmountError"
              :error-messages="maxAmountErrorMessage"
            /> </v-col
        ></v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

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
        <v-list-item :ripple="true" @click.prevent="">
          <template v-slot:prepend>
            <v-avatar color="grey-darken-1"
              ><v-icon>{{
                icons[record.category] || 'mdi-help-circle'
              }}</v-icon></v-avatar
            >
          </template>

          <v-list-item-title class="d-flex justify-space-between align-center"
            ><div class="category">
              {{ record.category }}
            </div>
            <div class="note" style="max-width: 50%; overflow: auto">
              {{ record.note || '沒有備註' }}
            </div>

            <div class="div">
              <div
                class="amountAndDeleteIcon"
                style="
                  gap: 0.1rem;
                  display: flex;
                  justify-content: center;
                  flex-wrap: wrap;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div class="amountAndCurrency">
                  <v-chip
                    v-if="
                      !(
                        record.currencyCode === 'TWD' ||
                        record.currencyCode === null ||
                        record.currencyCode === undefined
                      )
                    "
                    >{{ Math.trunc(record.amount * record.rate) }}
                    {{ record.currencyCode }}</v-chip
                  >
                  <div
                    v-if="
                      !(
                        record.currencyCode === 'TWD' ||
                        record.currencyCode === null ||
                        record.currencyCode === undefined
                      )
                    "
                    class=""
                    style="text-align: center; font-size: 1.2rem"
                  >
                    ⇓
                  </div>
                  <div class="amount" style="text-align: center">
                    {{
                      Number.isInteger(record.amount)
                        ? record.amount
                        : record.amount.toFixed(2)
                    }}
                  </div>
                </div>

                <div
                  class="deleteIcon"
                  v-if="showEachRecordDeleteIcon"
                  @click="deleteRecord(record)"
                >
                  <v-icon>mdi-delete</v-icon>
                </div>
              </div>
            </div>
          </v-list-item-title>
        </v-list-item>

        <v-divider inset></v-divider>
      </template>
    </v-list>
  </v-card>
  <div class="fixed-speed-dial">
    <v-speed-dial location="top center" transition="scale-transition">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" :size="fabSize" icon="mdi-menu"></v-fab>
      </template>

      <v-tooltip location="left">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :size="btnSize"
            icon="mdi-currency-usd"
            @click="isShowSetBudgetDialog = true"
          />
        </template>
        <span>預算設定</span>
      </v-tooltip>

      <v-tooltip location="left">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :size="btnSize"
            icon="mdi-folder-cog"
            @click="
              isShowCategoryManagementComponent =
                !isShowCategoryManagementComponent
            "
          />
        </template>
        <span>分類管理</span>
      </v-tooltip>

      <v-tooltip location="left">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :size="btnSize"
            icon="mdi-delete"
            @click="showEachRecordDeleteIcon = !showEachRecordDeleteIcon"
          />
        </template>
        <span>刪除記帳</span>
      </v-tooltip>

      <v-tooltip location="left">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :size="btnSize"
            icon="mdi-plus"
            @click="isShowDialogForm = true"
          />
        </template>
        <span>新增記帳</span>
      </v-tooltip>
    </v-speed-dial>
  </div>
  <VuetifyForm
    v-model="isShowDialogForm"
    :selectItems="selectItems"
    :all-categories-data="allCategoriesData"
    @fetch-records-by-book="fetchRecordsByBook(TransactionStore.selectedBook)"
  />

  <VuetifyCategoryManagement
    v-model:isShowDialogCategoryManagement="isShowCategoryManagementComponent"
    :all-categories-data="allCategoriesData"
    @parent-component-refresh-category-data="fetchCategoryByUser"
  />

  <VuetifySetBudgetDialog
    v-model="isShowSetBudgetDialog"
    :all-categories-data="allCategoriesData"
    @close="isShowSetBudgetDialog = false"
  />
</template>
<script setup>
import { useTransactionStore } from '@/stores/useTransactionStore';
import axios from 'axios';
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import debounce from 'lodash/debounce';
import { useRouter } from 'vue-router';
// import VuetifyForm from '@/components/VuetifyAddNewAccountDialog.vue';
// import VuetifyCategoryManagement from '@/components/VuetifyCategoryManagementDialog.vue';
// import VuetifySetBudgetDialog from '@/components/VuetifySetBudgetDialog.vue';
const VuetifyCategoryManagement = defineAsyncComponent(() =>
  import('@/components/VuetifyCategoryManagementDialog.vue')
);
const VuetifySetBudgetDialog = defineAsyncComponent(() =>
  import('@/components/VuetifySetBudgetDialog.vue')
);
const VuetifyForm = defineAsyncComponent(() =>
  import('@/components/VuetifyAddNewAccountDialog.vue')
);

const router = useRouter();

const records = ref([]); // 從後端獲取的記帳資料
let filteredRecords = ref([]); // 篩選後的記帳資料(這個資料會經過recordsByDate處理為template需要的格式)

const isShowDialogForm = ref(false);
const isShowCategoryManagementComponent = ref(false);
const isShowSetBudgetDialog = ref(false);

const cleanupController = new AbortController();
const fetchRecordsByBook = async (bookId) => {
  const response = await axios.get(
    `${process.env.VUE_APP_BACKEND_API_URL}/test/getRecordsByBook`,
    {
      params: { bookId },
      withCredentials: true,
      signal: cleanupController.signal,
    }
  );
  // date.value裡面存放日期

  records.value = response.data.records;
  filteredRecords.value = [...records.value];

  console.log('response.data: ', response.data);
  console.log('records.value: ', records.value);
};

let selectItems = ['fsfdd', 'sdfsdf', 'efd', 'dfbb', 'fsfe']; // 只存放類別名稱的陣列
const allCategoriesData = ref([]); // 用來存放所有類別的資料

const fetchCategoryByUser = async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_BACKEND_API_URL}/category/getCategories`,
    {
      withCredentials: true,
      signal: cleanupController.signal,
    }
  );

  selectItems = response.data.categories.map((category) => category.name);
  allCategoriesData.value = response.data.categories;
  console.log('allCategoriesData.value: ', allCategoriesData.value);
};

// recordsByDate格式為: [[日期1, [該日期記帳資料1, 記帳資料2, ...]], [日期2, [該日期記帳資料1, 記帳資料2, ...]], ...]
const recordsByDate = computed(() => {
  const grouped = {};

  filteredRecords.value.forEach((record) => {
    const dateOnly = record.date.slice(0, 10); // 取出 YYYY-MM-DD
    if (!grouped[dateOnly]) {
      grouped[dateOnly] = [];
    }
    grouped[dateOnly].push(record);
  });

  const result = Object.entries(grouped)
    .map(([date, records]) => {
      // 每一天內的資料依照時間降冪排序（從新到舊）
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
      return [date, records];
    })
    .sort((a, b) => new Date(b[0]) - new Date(a[0])); // 日期排序（從新到舊)

  return result;
});

const TransactionStore = useTransactionStore();
if (TransactionStore.selectedBook) {
  onMounted(() => {
    fetchRecordsByBook(TransactionStore.selectedBook);
    fetchCategoryByUser();
  });
} else {
  alert('請先選擇記帳本');
  router.push('/accountBook');
}

// 調整v-speed-dial大小
const display = useDisplay();

const fabSize = computed(() => (display.smAndDown.value ? 'large' : 'x-large'));
const btnSize = computed(() => (display.smAndDown.value ? 'small' : 'large'));

// v-select組件 (下拉選擇篩選類別) 程式碼---------------------
const selectValue = ref([]); // selectValue的watch跟金錢範圍的watch是同一個

const selectExpenseOrIncome = ref('expense');

// v-text-filed組件 (選擇金額範圍的) 程式碼 -----------------
const maxAmount = ref();
const minAmount = ref();
let maxAmountError = ref(false);
let minAmountError = ref(false);
let maxAmountErrorMessage = ref('');
let minAmountErrorMessage = ref('');
const errorMessage = ['最低金額不能超過最高金額'];

// 建立防抖函式，避免用戶輸入時過早觸發驗證
// 用於篩選記帳的函數
const handleAmountChangeAndCategoryChange = debounce(
  (newMax, newMin, oldMax, oldMin) => {
    console.log('newMax: ', newMax, 'newMax===""', newMax === '');
    console.log(newMin);
    // 將輸入轉成數字，避免字串比較問題
    const min = newMin === '' ? NaN : Number(newMin);
    const max = newMax === '' ? NaN : Number(newMax);

    // reset
    minAmountError.value = false;
    maxAmountError.value = false;
    minAmountErrorMessage.value = '';
    maxAmountErrorMessage.value = '';

    let filterFn;
    // 如果 min 和 max 都有值，才做比較與錯誤提示
    if (!isNaN(min) && !isNaN(max)) {
      const isIncome =
        selectExpenseOrIncome.value === 'isIncome' ? true : false;

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
        isIncome === record.isIncome;
    } else if (!isNaN(min)) {
      const isIncome =
        selectExpenseOrIncome.value === 'isIncome' ? true : false;
      filterFn = (record) =>
        record.amount >= min &&
        (selectValue.value.length === 0 ||
          selectValue.value.includes(record.category)) &&
        isIncome === record.isIncome;
    } else if (!isNaN(max)) {
      const isIncome =
        selectExpenseOrIncome.value === 'isIncome' ? true : false;
      filterFn = (record) =>
        record.amount <= max &&
        (selectValue.value.length === 0 ||
          selectValue.value.includes(record.category)) &&
        isIncome === record.isIncome;
    } else {
      const isIncome =
        selectExpenseOrIncome.value === 'isIncome' ? true : false;
      filterFn = (record) =>
        true &&
        (selectValue.value.length === 0 ||
          selectValue.value.includes(record.category)) &&
        isIncome === record.isIncome; // 無篩選條件
    }

    // 篩選資料
    filteredRecords.value = records.value.filter(filterFn);
  },
  500
);

// 監聽變更金錢範圍變更，但觸發的是防抖函式
watch(
  [minAmount, maxAmount, selectValue, selectExpenseOrIncome],
  ([newMin, newMax], [oldMin, oldMax]) => {
    handleAmountChangeAndCategoryChange(newMax, newMin, oldMax, oldMin);
  }
);

// categories對應的icons
const icons = {
  餐飲: 'mdi-silverware-fork-knife',
  交通: 'mdi-bus',
  娛樂: 'mdi-controller-classic',
  其他: 'mdi-dots-horizontal',
  薪水: 'mdi-briefcase',
  投資: 'mdi-finance',
};

const showEachRecordDeleteIcon = ref(false);

async function deleteRecord(record) {
  console.log('record', record);
  if (confirm('確定要刪除這筆記帳嗎？')) {
    // 找到v-select選取的category所對應的Object
    const findTheCategoryObjecte = computed(() => {
      return allCategoriesData.value.find(
        (item) => item.name === record.category
      );
    });
    console.log('findTheCategoryObjecte: ', findTheCategoryObjecte.value);

    await axios
      .delete(
        `${process.env.VUE_APP_BACKEND_API_URL}/test/deleteRecordByBook`,
        {
          params: {
            recordId: record._id,
            bookId: TransactionStore.selectedBook,
            categoryId: findTheCategoryObjecte.value._id,
            isIncome: record.isIncome,
            amount: record.amount,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log('刪除成功:', response.data);
        // 刪除後重新獲取記帳資料
        fetchRecordsByBook(TransactionStore.selectedBook);
      })
      .catch((error) => {
        console.error('刪除失敗:', error);
      });
  }
}
</script>

<style scoped>
.fixed-speed-dial {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}

@media (min-width: 400px) {
  .fixed-speed-dial {
    position: fixed;
    bottom: 3rem;
    right: 3rem;
  }
}

@media (min-width: 600px) {
  .fixed-speed-dial {
    position: fixed;
    bottom: 5rem;
    right: 5rem;
  }
}

/* 桌機以上 */
/* @media (min-width: 960px) {
  .v-speed-dial-Container {
    position: fixed;
    bottom: 4rem;
    right: 4rem;
    z-index: 1000;
  }
} */
</style>
