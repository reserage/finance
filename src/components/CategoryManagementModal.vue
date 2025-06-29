<template>
  <button
    type="button"
    class="btn btn-outline-secondary"
    @click="openCategoryManager"
  >
    管理類別
  </button>

  <!-- 新增的類別管理 Modal -->
  <div
    v-if="isCategoryManagerOpen"
    class="modal fade show"
    tabindex="-1"
    style="display: block"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">管理類別</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeCategoryManager"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <h6>收入類別</h6>
            <div
              v-for="(category, index) in tempIncomeCategories"
              :key="category._id || 'income-' + index"
              class="d-flex mb-2"
            >
              <input
                type="text"
                class="form-control"
                v-model="tempIncomeCategories[index].name"
                readonly
              />
              <button
                class="btn btn-danger ms-2"
                @click.prevent="removeCategory('income', index)"
              >
                刪除
              </button>
            </div>
            <button
              class="btn btn-sm btn-success"
              @click.prevent="addCategory('income')"
              v-if="!isIncomeAddingCategory"
            >
              + 新增收入類別
            </button>
            <label for="addingIncome" v-if="isIncomeAddingCategory"
              >輸入新類別名稱</label
            >
            <input
              type="text"
              class="form-control"
              id="addingIncome"
              v-if="isIncomeAddingCategory"
              v-model="incomeTempName"
              @keydown.enter="addingTempCategory('income')"
            />
          </div>

          <div class="mb-3">
            <h6>支出類別</h6>
            <div
              v-for="(category, index) in tempExpenseCategories"
              :key="category._id || 'expense-' + index"
              class="d-flex mb-2"
            >
              <input
                type="text"
                class="form-control"
                v-model="tempExpenseCategories[index].name"
                readonly
              />
              <button
                class="btn btn-danger ms-2"
                @click.prevent="removeCategory('expense', index)"
              >
                刪除
              </button>
            </div>
            <button
              class="btn btn-sm btn-success"
              @click.prevent="addCategory('expense')"
              v-if="!isExpenseAddingCategory"
            >
              + 新增支出類別
            </button>
            <label for="addingExpense" v-if="isExpenseAddingCategory"
              >輸入新類別名稱</label
            >
            <input
              type="text"
              class="form-control"
              id="addingExpense"
              v-if="isExpenseAddingCategory"
              v-model="expenseTempName"
              @keydown.enter="addingTempCategory('expense')"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeCategoryManager"
          >
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="saveCategories">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 遮罩层 -->
  <div
    v-if="isCategoryManagerOpen"
    class="modal-backdrop fade show"
    style="z-index: 1040"
  ></div>
</template>

<script setup>
// 使用這個組件的父組件需要傳入兩個props: incomeCategories 和 expenseCategories
// 之後將這兩個props複製一份到臨時變數中，然後在modal中進行編輯
// 新增 或 刪除的類別會發送到後端，然後更新父組件的props

import { ref, defineExpose, defineEmits, defineProps } from "vue";
import axios from "axios";
// import { all } from "core-js/fn/promise";

const props = defineProps({
  incomeCategories: Array,
  expenseCategories: Array,
});

const emit = defineEmits(["categories-updated"]);

// 新增的類別管理狀態
const isCategoryManagerOpen = ref(false); // 用來控制modal的開關變數
// 這兩個變數控制顯示到畫面上的類別資料
const tempIncomeCategories = ref([]);
const tempExpenseCategories = ref([]);

// ------------------------------------ 開啟和關閉modal
// 打開類別管理 Modal

// 將父組件傳入的props類別資料複製到臨時變數中
const openCategoryManager = () => {
  console.log("執行openCategoryManager方法");

  tempIncomeCategories.value = [];
  tempExpenseCategories.value = [];

  console.log("props.incomeCategories:", props.incomeCategories);
  console.log("props.expenseCategories:", props.expenseCategories);

  // 確保總是初始化為陣列
  tempIncomeCategories.value = Array.isArray(props.incomeCategories)
    ? props.incomeCategories.map((category) => ({ ...category }))
    : [];

  tempExpenseCategories.value = Array.isArray(props.expenseCategories)
    ? props.expenseCategories.map((category) => ({ ...category }))
    : [];

  console.log("tempIncomeCategories:", tempIncomeCategories.value);
  console.log("tempExpenseCategories:", tempExpenseCategories.value);

  isCategoryManagerOpen.value = true;
  console.log("結束openCategoryManager方法");
};

// 關閉類別管理 Modal
const closeCategoryManager = () => {
  isCategoryManagerOpen.value = false;
  isIncomeAddingCategory.value = false;
  isExpenseAddingCategory.value = false;
  incomeTempName.value = ""; // 清空輸入框
  expenseTempName.value = "";
  console.log(
    "closeCategoryManager()觸發時，tempIncomeCategories:",
    tempIncomeCategories.value
  );
  console.log(
    "closeCategoryManager()觸發時，tempExpenseCategories:",
    tempExpenseCategories.value
  );
};

// 保存類別修改，用於 保存的button標籤按鈕，將臨時變數傳給父組件
const saveCategories = async () => {
  console.log("執行saveCategories方法");
  console.log(
    "保存時的臨時變數:",
    tempIncomeCategories.value,
    tempExpenseCategories.value
  );

  console.warn("saveCategories內的 allIncomeCategory:", allIncomeCategory);
  console.warn("saveCategories內的 allExpenseCategory:", allExpenseCategory);

  await axios.post(
    `${process.env.VUE_APP_BACKEND_API_URL}/category/update`,
    {
      incomeCategories: allIncomeCategory,
      expenseCategories: allExpenseCategory,
    },
    { withCredentials: true }
  );

  await axios.delete(`${process.env.VUE_APP_BACKEND_API_URL}/category/deleteCategory`, {
    data: { deletedCategories: deletedCategories },
    withCredentials: true,
  });

  deletedCategories = [];

  allIncomeCategory = [];
  allExpenseCategory = [];

  console.warn("saveCategories結束前的 allIncomeCategory:", allIncomeCategory);
  console.warn(
    "saveCategories結束前的 allExpenseCategory:",
    allExpenseCategory
  );

  emit("categories-updated");
  closeCategoryManager();
  console.log("結束saveCategories方法");
};

// ---------------------------------------- 新增類別 與 刪除類別
const isIncomeAddingCategory = ref(false);
const isExpenseAddingCategory = ref(false);
const incomeTempName = ref("");
const expenseTempName = ref("");

// 設定用來傳給後端的類別資料，這兩個變數用來存放新增的類別名稱
let allIncomeCategory = [];
let allExpenseCategory = [];

// 用於button標籤的方法，當按下新增類別按鈕時觸發
const addCategory = (type) => {
  ///////////////////////////////
  if (type === "income") {
    isIncomeAddingCategory.value = true;
  } else {
    isExpenseAddingCategory.value = true;
  }
};

// 用於input標籤的方法，當按下enter鍵時觸發
async function addingTempCategory(category) {
  console.log("執行addingTempCategory方法", category);

  if (category === "income") {
    const newCategory = {
      _id: null,
      name: incomeTempName.value,
    };
    tempIncomeCategories.value.unshift(newCategory);
    allIncomeCategory.push(newCategory);

    // 將新增的income數據發送到後端

    isIncomeAddingCategory.value = false;
  } else {
    const newCategory = { _id: null, name: expenseTempName.value };
    tempExpenseCategories.value.unshift(newCategory);
    allExpenseCategory.push(newCategory);

    // 將新增的expense數據發送到後端

    isExpenseAddingCategory.value = false;
  }
  incomeTempName.value = ""; // 清空輸入框
  expenseTempName.value = "";

  console.warn(
    "addingTempCategory方法內的 allIncomeCategory:",
    allIncomeCategory
  );
  console.warn(
    "addingTempCategory方法內的 allExpenseCategory:",
    allExpenseCategory
  );

  console.log("addingTempCategory方法 結束", category);
}
let deletedCategories = [];
// 刪除類別
const removeCategory = (type, index) => {
  if (type === "income") {
    const removedCategory = tempIncomeCategories.value.splice(index, 1)[0];
    deletedCategories.push(removedCategory);
  } else {
    const removedCategory = tempExpenseCategories.value.splice(index, 1)[0];
    deletedCategories.push(removedCategory);
  }
};

// 將方法暴露給父組件
defineExpose({
  openCategoryManager,
});
</script>

<style>
.modal-content {
  max-height: 80vh;
  /* 限制为视口高度的80% */
  overflow-y: auto;
  /* 内容超出时滚动 */
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
