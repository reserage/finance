<template>
  <!-- 觸發 Modal 的按鈕 -->
  <button type="button" class="btn btn-primary" @click="openModal">
    新增記帳
  </button>

  <!-- Modal -->
  <div
    v-if="isModalOpen"
    class="modal fade show"
    tabindex="-1"
    style="display: block"
  >
    <div class="modal-dialog modal-xl custom-modal-center">
      <div class="modal-content">
        <!-- Modal 標題 -->
        <div class="modal-header">
          <h5 class="modal-title">新增記帳</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <!-- Modal 內容 -->
        <div class="modal-body">
          <form>
            <!-- 收入/支出選擇 -->
            <div class="mb-3">
              <label class="form-label">類型</label>
              <div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="income"
                    value="income"
                    v-model="record.isIncome"
                  />
                  <label class="form-check-label" for="income">收入</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="expense"
                    value="expense"
                    v-model="record.isIncome"
                  />
                  <label class="form-check-label" for="expense">支出</label>
                </div>
              </div>
            </div>

            <!-- 金額輸入 -->
            <div class="mb-3">
              <label for="amount" class="form-label">金額</label>
              <input
                type="number"
                class="form-control"
                id="amount"
                v-model="record.amount"
                placeholder="輸入金額"
              />
            </div>

            <!-- 類別選擇 -->
            <div class="mb-3">
              <label for="category" class="form-label">類別</label>
              <div class="d-flex align-items-center gap-2">
                <select
                  class="form-select"
                  id="category"
                  v-model="record.category"
                >
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
                <CategoryManagementModal
                  :income-categories="incomeCategories"
                  :expense-categories="expenseCategories"
                  @categories-updated="handleCategoriesUpdated"
                />
              </div>
            </div>

            <!-- 日期選擇 -->
            <div class="mb-3">
              <label for="date" class="form-label">日期</label>
              <input
                type="date"
                class="form-control"
                id="date"
                v-model="record.date"
              />
            </div>

            <!-- 備註輸入 -->
            <div class="mb-3">
              <label for="note" class="form-label">備註</label>
              <textarea
                class="form-control"
                id="note"
                rows="3"
                v-model="record.note"
                placeholder="輸入備註"
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Modal 底部按鈕 -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="saveRecord">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 遮罩層 -->
  <div v-if="isModalOpen" class="modal-backdrop fade show"></div>
</template>

<script setup>
import axios from "axios";
import CategoryManagementModal from "./CategoryManagementModal.vue";
import { ref, computed, defineEmits, onMounted, onBeforeUnmount } from "vue";

// 定義 Modal 的狀態
const isModalOpen = ref(false);

// 定義記帳數據
const record = ref({
  amount: "",
  category: "",
  date: "",
  note: "",
  isIncome: "expense", // 預設為支出
});

// 定義收入與支出的類別選項
const incomeCategories = ref([]);
const expenseCategories = ref([]);

onMounted(() => {
  fetchCategories();
});

const modalController = ref(new AbortController());

onBeforeUnmount(() => {
  // 清理模态框相关资源
  if (modalController.value) {
    modalController.value.abort();
  }
});

// 用來從後端獲取類別數據的函數，再將類別名放在 incomeCategories 和 expenseCategories 中
// 使用時機: 組件掛載時 以及 CategoryManagementModal 中新增類別後再次打開management modal 時
async function fetchCategories() {
  console.log("這裡是ComputerRecordModal 組件，fetchCategories() 的開始");
  try {
    const res = await axios.get(
      "http://localhost:5000/category/getCategories",
      {
        withCredentials: true,
        signal: modalController.value.signal,
      }
    );
    const categories = res.data.categories;
    categories.reverse();
    console.log(Array.isArray(categories), categories);
    incomeCategories.value = categories.filter((c) => c.isIncome);
    expenseCategories.value = categories.filter((c) => !c.isIncome);

    console.log(
      "這裡是ComputerRecordModal 組件，從後端取出的categories",
      categories
    );
    console.log("這裡是ComputerRecordModal 組件，fetchCategories() 的結束");
  } catch (err) {
    console.error("categories獲取失敗", err);
  }
}

// 根據 isIncome 的值動態返回對應的類別選項
const categories = computed(() => {
  return record.value.isIncome === "income"
    ? incomeCategories.value.map((c) => c.name)
    : expenseCategories.value.map((c) => c.name);
});

// 打開 Modal
const openModal = () => {
  isModalOpen.value = true;

  if (!record.value) {
    resetForm();
  }
  // 設定今天日期
  const today = new Date().toISOString().split("T")[0];
  record.value.date = today;
};

// 關閉 Modal
const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

// 保存記帳數據
const saveRecord = () => {
  // 檢查數據是否有效
  if (!record.value.amount || !record.value.category || !record.value.date) {
    alert("請填寫完整信息");
    return;
  }

  // 輸出記帳數據（這裡可以改為發送到後端）
  console.log("保存的記帳數據：", record.value);

  sendToBackend();
  // 關閉 Modal
  closeModal();
};

// 重置表單
const resetForm = () => {
  record.value = {
    amount: "",
    category: "",
    date: "",
    note: "",
    isIncome: "expense", // 重置為支出
  };
};

const emit = defineEmits(["modalData"]);
function sendToBackend() {
  console.log("sendToBackend()被觸發了");
  console.log("發送數據到後端(sendToBackend()內的)", record.value);
  // 將數據發送到後端
  axios
    .post("http://localhost:5000/test/addRecord", record.value, {
      withCredentials: true,
    })
    .then((res) => {
      console.log("res.data.record", res.data.record);
      console.log("sendToBackend()結束，觸發 emit");
      emit("modalData", record.value);
    })
    .catch((err) => {
      console.error("ComputerRecordModal發送數據到後端失敗", err);
    });
}

// --------------------------------------------- 類別管理組件的

// 這裡用於接收從 CategoryManagementModal 傳遞過來的類別數據
const handleCategoriesUpdated = () => {
  fetchCategories();
};
</script>

<style scoped>
/* 自定義 Modal 樣式 */
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 1.75rem auto;
}

.modal-content {
  border-radius: 0.3rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
