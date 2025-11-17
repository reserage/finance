<template>
  <!-- 選擇選分下拉選單 -->
  <div>
    <v-row
      ><v-col cols="9" sm="11" class="pt-0"
        ><v-autocomplete
          v-model="year"
          :items="years"
          label="選擇年份"
        ></v-autocomplete>
      </v-col>
      <v-col cols="3" sm="1"
        ><v-btn variant="tonal" @click="isOpenBindLineDialog = true"
          >綁定Line</v-btn
        >
      </v-col>
    </v-row>

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
        <v-card
          class="responsive-card position-relative"
          ripple
          @click="handleClick(card._id)"
        >
          <v-card-title class="fs-2">
            <v-icon class="mr-2" color="primary">mdi-book</v-icon
            >{{ card.name }}</v-card-title
          >
          <v-card-text class="fs-6">
            {{ card.description }}
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <!-- // todo: click的事件還沒做 -->
            <v-btn
              class="position-absolute top-0 end-0"
              icon
              @click.stop="openEditDialog(card)"
            >
              <v-icon color="primary">mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
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
          @click="openAddingDialog"
        >
          新增記帳本
        </v-btn></v-col
      ></v-row
    >

    <v-dialog
      v-model="addingAndEditingDialogIsOpen"
      max-height="80%"
      width="600px"
    >
      <v-card :title="dialogConfig[currentDialogMode].title">
        <v-card-text>
          <v-form v-model="formIsValid" ref="formRef">
            <v-text-field
              class="mb-2"
              v-model="form.name"
              label="記帳本名稱"
              :rules="rules.vTextField"
              required
            ></v-text-field>
            <v-textarea
              v-model="form.description"
              label="記帳本描述"
              :rules="rules.vTextarea"
              rows="3"
            ></v-textarea>
            <v-card-actions>
              <!--//desc v-spacer的作用是將按鈕推到右側 ， v-spacer會佔據剩餘空間 -->
              <v-spacer></v-spacer
              ><v-btn
                color="red"
                variant="elevated"
                @click.stop="closeAddingAndEditingDialog()"
                >取消</v-btn
              >
              <v-btn
                color="primary"
                variant="elevated"
                @click.stop="dialogConfig[currentDialogMode].buttonAction()"
                >{{ dialogConfig[currentDialogMode].buttonText }}</v-btn
              ></v-card-actions
            >
          </v-form>
          <v-btn
            color="red"
            variant="outlined"
            v-if="currentDialogMode === 'editing'"
            @click.stop="removeBookKeeping"
            >刪除記帳本</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isOpenBindLineDialog" max-height="80%" width="300px">
      <v-card :title="綁定line">
        <v-card-text
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          "
        >
          <v-btn variant="tonal" @click="bindLine">獲得綁定碼</v-btn>
          <span v-if="showLineCode"
            >在line上輸入 "綁定 {{ lineBindCode }}"</span
          >
          <img
            :src="require('@/assets/smallLineQRcode.png')"
            alt="lineQRcode"
            style="display: block"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-overlay :model-value="loading" opacity="0.6">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </div>
</template>
<script setup>
import router from '@/router';
import { useTransactionStore } from '@/stores/useTransactionStore';
import axios from 'axios';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useLoading } from '@/composables/useLoading';
const { loading, wrap } = useLoading();

const bookInfo = ref([]);

// 真正的年份數據應該從後端獲取，這裡僅作為範例
const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
const year = ref('2025');

// info: 當點擊記帳本時 的動作 -------------------
const TransactionStore = useTransactionStore();
function handleClick(bookId) {
  TransactionStore.setSelectedBook(bookId);
  console.log(TransactionStore.selectedBook);
  router.push('/bookKeeping');
}

// info: 新增 和 修改 記帳本的對話框 -------------------
const addingAndEditingDialogIsOpen = ref(false);
const isOpenBindLineDialog = ref(false);

const formRef = ref(null);
const formIsValid = ref(false);

const showLineCode = ref(false);
const lineBindCode = ref('');

const form = ref({
  name: '',
  description: '',
});

// desc: 用來儲存對話框 新增 和 修改 的配置
const dialogConfig = ref({
  adding: {
    title: '新增記帳本',
    buttonText: '新增',
    buttonAction: () => {
      createBookKeeping();
    },
  },
  editing: {
    title: '修改記帳本',
    buttonText: '修改',
    buttonAction: () => {
      editngBookKeeping();
    },
  },
});
const currentDialogMode = ref('adding');

// desc: 新增 和 修改 記帳本對話框裡的 表單驗證規則
const rules = {
  // desc: 驗證是必填的，且長度必須小於等於10個字
  vTextField: [
    (v) => !!v || '名字不能為空',
    (v) => v.length <= 10 || '名字不能超過10個字',
  ],

  // desc: 驗證是選填的(允許為空值)，如果有值則必須小於等於50個字
  vTextarea: [
    (v) =>
      v === null ||
      v === '' ||
      v === undefined ||
      v.length <= 50 ||
      '描述不能超過50個字',
  ],
};

const removeBookKeeping = async () => {
  if (confirm('確定要刪除這個記帳本嗎？')) {
    console.log('刪除記帳本的動作');
    // info: 這裡應該是發送請求到後端刪除記帳本
    await wrap(async () => {
      await axios
        .delete(
          `${process.env.VUE_APP_BACKEND_API_URL}/bookKeeping/delete/${currentEditingBook.value}`,
          { withCredentials: true }
        )
        .then((response) => {
          console.log('刪除成功:', response.data);
          closeAddingAndEditingDialog();
          getBook(); // 重新獲取記帳本列表
          currentEditingBook.value = null;
        })
        .catch((error) => {
          console.error('刪除失敗:', error);
        });
    });
  } else {
    console.log('取消刪除記帳本');
    return;
  }
};

const createBookKeeping = async () => {
  console.log('新增記帳本的動作');
  // info: 這裡應該是發送請求到後端新增記帳本
  await wrap(async () => {
    await axios
      .post(
        `${process.env.VUE_APP_BACKEND_API_URL}/bookKeeping/create`,
        {
          name: form.value.name,
          description: form.value.description,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log('新增成功:', response.data);
        closeAddingAndEditingDialog();
        getBook(); // 重新獲取記帳本列表
      })
      .catch((error) => {
        console.error('新增失敗:', error);
      });
  });
};

const editngBookKeeping = async () => {
  console.log('修改記帳本的動作');
  // info: 這裡應該是發送請求到後端修改記帳本
  await wrap(async () => {
    await axios
      .patch(
        `${process.env.VUE_APP_BACKEND_API_URL}/bookKeeping/edit`,
        {
          bookId: currentEditingBook.value, // 使用當前編輯的記帳本ID
          name: form.value.name,
          description: form.value.description,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log('修改成功:', response.data);
        closeAddingAndEditingDialog();
        getBook(); // 重新獲取記帳本列表
        currentEditingBook.value = null;
      })
      .catch((error) => {
        console.error('修改失敗:', error);
      });
  });
};

const bindLine = async () => {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/line/bind/code`,
      {},
      { withCredentials: true }
    );

    console.log(response.data);
    lineBindCode.value = ref(response.data.data.bindCode);
    showLineCode.value = true;
  } catch (error) {
    console.log('error', error);
    if (
      error.response.data.error.statusCode == 400 ||
      error.response.data.error.statusCode == 404
    ) {
      alert(error.response.data.message);
      return;
    }
  }
};

const currentEditingBook = ref(null);

// todo: 處理點擊編輯按鈕的動作
const openEditDialog = (card) => {
  currentDialogMode.value = 'editing';
  addingAndEditingDialogIsOpen.value = true;
  form.value.name = card.name;
  form.value.description = card.description;
  currentEditingBook.value = card._id;
};

const openAddingDialog = () => {
  currentDialogMode.value = 'adding';
  addingAndEditingDialogIsOpen.value = true;
  // * 清除表單內容，避免重複使用時出現舊數據 */
  form.value = {
    name: '',
    description: '',
  };
};

const closeAddingAndEditingDialog = () => {
  addingAndEditingDialogIsOpen.value = false;
  nextTick(() => {
    form.value = {
      name: '',
      description: '',
    };
    // * 清除兩次表單為保險表單內容為清除
    formRef.value?.reset(); //* 不止清除表單內容，也會清除驗證狀態
  });
  formIsValid.value = false;
};

// info: 組件載入時的動作 ----------------------
async function getBook() {
  await wrap(async () => {
    try {
      const response = await axios.get(
        `${process.env.VUE_APP_BACKEND_API_URL}/bookKeeping/getbookKeepings`,
        {
          params: { year: year.value },
          withCredentials: true,
        }
      );
      console.log('response.data', response.data);

      bookInfo.value = response.data.gotBookKeeping;
      console.log('更新後的bookInfo: ', bookInfo.value);
    } catch (e) {
      if (e.status == 401) {
        alert(e.response.data.message);
        router.push('/auth/login');
      }
    }
  });
}
onMounted(() => {
  getBook();
});

// info: 其他東西
watch(year, (newValue) => {
  getBook(newValue);
  console.log(newValue);
});

onMounted(async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_BACKEND_API_URL}/api/v1/exchangeRate/TWD`
  );
  console.log('response', response);
});
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
