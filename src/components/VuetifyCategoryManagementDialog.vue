<template>
  <v-dialog v-model="isShowDialogCategoryManagement" max-width="unset">
    <v-card>
      <v-card-title class="text-h6">分類管理</v-card-title>
      <v-card-text class="d-flex">
        <!-- 桌面板畫面 -->
        <v-row v-if="!isMobile">
          <!-- //desc 電腦板 新增新分類的form -->
          <v-expand-transition mode="out-in">
            <div v-if="isShowAddForm" class="w-100">
              <v-col class="mb-4" cols="12">
                <v-text-field
                  label="分類名稱"
                  v-model="categoryForm.name"
                  required
                ></v-text-field>
                <v-radio-group
                  label="分類類型"
                  v-model="categoryForm.isIncome"
                  inline="true"
                >
                  <v-radio label="收入" :value="true"></v-radio>
                  <v-radio label="支出" :value="false"></v-radio>
                </v-radio-group>
                <v-btn
                  @click.prevent="isShowAddForm = false"
                  color="grey"
                  class="me-2"
                  >取消</v-btn
                >
                <v-btn
                  type="submit"
                  color="primary"
                  class="me-2"
                  @click.prevent="currentButtonAndAction.action"
                  >{{ currentButtonAndAction.buttonText }}</v-btn
                >
              </v-col>
            </div>
          </v-expand-transition>

          <v-col cols="12" lg="6"
            ><v-card style="max-height: 50vh; overflow: auto">
              <v-card-title class="text-h6">支出類別</v-card-title>
              <v-card-text>
                <v-list>
                  <template
                    v-for="(item, index) in expenseCategoryItems"
                    :key="index"
                    ><v-list-item ripple="true" @click.prevent="">
                      <div
                        class="d-flex justify-space-between"
                        style="width: 100%"
                      >
                        <v-list-item-title class="fs-5">
                          {{ item.name }}
                        </v-list-item-title>
                        <v-menu offset-y>
                          <template #activator="{ props }"
                            ><v-btn v-bind="props"
                              ><v-icon class="fs-4">mdi-delete</v-icon></v-btn
                            ></template
                          >

                          <v-list>
                            <v-list-item
                              v-for="option in clickModificationIconShowList(
                                item
                              )"
                              :key="option.key"
                              @click="option.callback"
                            >
                              <v-list-item-title>{{
                                option.key
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div> </v-list-item
                    ><v-divider />
                  </template>
                </v-list>
              </v-card-text> </v-card
          ></v-col>
          <v-col cols="12" lg="6"
            ><v-card style="max-height: 50vh; overflow: auto">
              <v-card-title class="text-h6">收入類別</v-card-title>
              <v-card-text>
                <v-list>
                  <template
                    v-for="(item, index) in incomeCategoryItems"
                    :key="index"
                    ><v-list-item ripple="true" @click.prevent="">
                      <div
                        class="d-flex justify-space-between"
                        style="width: 100%"
                      >
                        <v-list-item-title class="fs-5">
                          {{ item.name }}
                        </v-list-item-title>
                        <v-menu offset-y>
                          <template #activator="{ props }"
                            ><v-btn v-bind="props"
                              ><v-icon class="fs-4">mdi-delete</v-icon></v-btn
                            ></template
                          >

                          <v-list>
                            <v-list-item
                              v-for="option in clickModificationIconShowList(
                                item
                              )"
                              :key="option.key"
                              @click="option.callback"
                            >
                              <v-list-item-title>{{
                                option.key
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div> </v-list-item
                    ><v-divider />
                  </template>
                </v-list>
              </v-card-text> </v-card
          ></v-col>
        </v-row>

        <!-- 手機板畫面 -->
        <v-row v-else>
          <!-- //desc 手機板 新增新分類的form -->
          <v-expand-transition mode="out-in">
            <div v-if="isShowAddForm" class="w-100">
              <v-col class="mb-4" cols="12">
                <v-text-field
                  label="分類名稱"
                  v-model="categoryForm.name"
                  required
                ></v-text-field>
                <v-radio-group
                  label="分類類型"
                  v-model="categoryForm.isIncome"
                  inline="true"
                >
                  <v-radio label="收入" :value="true"></v-radio>
                  <v-radio label="支出" :value="false"></v-radio>
                </v-radio-group>
                <v-btn @click="isShowAddForm = false" color="grey" class="me-2"
                  >取消</v-btn
                >
                <v-btn
                  type="submit"
                  color="primary"
                  class="me-2"
                  @click.prevent="currentButtonAndAction.action"
                  >{{ currentButtonAndAction.buttonText }}</v-btn
                >
              </v-col>
            </div>
          </v-expand-transition>
          <v-col cols="12" lg="6"
            ><v-card style="max-height: 50vh; overflow: auto">
              <v-card-title class="text-h6">支出類別</v-card-title>
              <v-card-text>
                <v-list>
                  <template
                    v-for="(item, index) in expenseCategoryItems"
                    :key="index"
                    ><v-list-item ripple="true" @click.prevent="">
                      <div
                        class="d-flex justify-space-between"
                        style="width: 100%"
                      >
                        <v-list-item-title class="fs-5">
                          {{ item.name }}
                        </v-list-item-title>
                        <v-menu offset-y>
                          <template #activator="{ props }"
                            ><v-btn v-bind="props"
                              ><v-icon class="fs-4">mdi-delete</v-icon></v-btn
                            ></template
                          >

                          <v-list>
                            <v-list-item
                              v-for="option in clickModificationIconShowList(
                                item
                              )"
                              :key="option.key"
                              @click="option.callback"
                            >
                              <v-list-item-title>{{
                                option.key
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div> </v-list-item
                    ><v-divider />
                  </template>
                </v-list>
              </v-card-text>
              <v-card-title class="text-h6">收入類別</v-card-title>
              <v-card-text>
                <v-list>
                  <template
                    v-for="(item, index) in incomeCategoryItems"
                    :key="index"
                    ><v-list-item ripple="true" @click.prevent="">
                      <div
                        class="d-flex justify-space-between"
                        style="width: 100%"
                      >
                        <v-list-item-title class="fs-5">
                          {{ item.name }}
                        </v-list-item-title>
                        <v-menu offset-y>
                          <template #activator="{ props }"
                            ><v-btn v-bind="props"
                              ><v-icon class="fs-4">mdi-delete</v-icon></v-btn
                            ></template
                          >

                          <v-list>
                            <v-list-item
                              v-for="option in clickModificationIconShowList(
                                item
                              )"
                              :key="option.key"
                              @click="option.callback"
                            >
                              <v-list-item-title>{{
                                option.key
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div> </v-list-item
                    ><v-divider />
                  </template>
                </v-list>
              </v-card-text> </v-card
          ></v-col>
        </v-row>
      </v-card-text>
      <v-card-actions
        ><v-btn @click="isShowDialogCategoryManagement = false">關閉</v-btn
        ><v-btn class="text-primary" @click.prevent="clickAddingButton()"
          >新增</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
  <v-overlay :model-value="loading" opacity="0.6">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
</template>
<script setup>
import axios from 'axios';
import {
  defineModel,
  defineProps,
  computed,
  defineEmits,
  ref,
  watch,
} from 'vue';
import { useDisplay } from 'vuetify';
import { useLoading } from '@/composables/useLoading';
const { loading, wrap } = useLoading();

const props = defineProps(['allCategoriesData']);
const emit = defineEmits(['parentComponentRefreshCategoryData']);

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);

// info 對分類的資料進行過濾 --------------
const expenseCategoryItems = computed(() => {
  return props.allCategoriesData.filter(
    (Category) => Category.isIncome === false
  );
});

const incomeCategoryItems = computed(() => {
  return props.allCategoriesData.filter(
    (Category) => Category.isIncome === true
  );
});

// info 用於控制對話框顯示的事件 -------------
// desc 從父組件傳入的props，控制dialog的顯示
const isShowDialogCategoryManagement = defineModel(
  'isShowDialogCategoryManagement',
  {
    default: false,
    type: Boolean,
  }
);

// info: 用於新增分類的form --------------
const isShowAddForm = ref(false);
const categoryForm = ref({
  name: '',
  isIncome: true,
});

let currentButtonAndAction = ref({
  buttonText: '新增',
  action: () => addNewCategory(),
});

// desc: 新增分類的函數
async function addNewCategory() {
  if (!categoryForm.value.name) {
    alert('請輸入分類名稱');
    return;
  }
  await wrap(async () => {
    try {
      const response = await axios.post(
        `${process.env.VUE_APP_BACKEND_API_URL}/category/addCategory`,
        categoryForm.value,
        { withCredentials: true }
      );
      console.log('新增分類成功: ', response.data);
      emit('parentComponentRefreshCategoryData');
      isShowAddForm.value = false; // 新增成功後關閉表單
    } catch (error) {
      console.error('新增分類失敗: ', error);
      alert('新增分類失敗，請稍後再試。');
    }
  });
}

// desc: 修改分類的函數
async function modifyCategory(categoryId) {
  await wrap(async () => {
    try {
      const response = await axios.patch(
        `${process.env.VUE_APP_BACKEND_API_URL}/category/modifyCategory/${categoryId}`,
        categoryForm.value,
        { withCredentials: true }
      );
      console.log('修改分類成功: ', response.data);
      isShowAddForm.value = false; // 修改成功後關閉表單
      emit('parentComponentRefreshCategoryData');
    } catch (e) {
      console.error('修改分類失敗: ', e);
      alert('修改分類失敗，請稍後再試。');
    }
  });
}

// desc: 對話框 或 表單 關閉時 將表單重置
watch(
  [isShowDialogCategoryManagement, isShowAddForm],
  ([newDialogVal, newFormVal]) => {
    if (!newDialogVal || !newFormVal) {
      isShowAddForm.value = false; // * 雖然會重複賦值 但沒關係
      categoryForm.value = { name: '', isIncome: true }; // 重置新增分類的表單
      currentButtonAndAction.value = {
        buttonText: '新增',
        action: () => addNewCategory(),
      }; //* 重置按鈕文字和事件
    }
  }
);

// desc: 點擊新增按鈕後， 先清空表單 後顯示新增分類的表單
const clickAddingButton = () => {
  isShowAddForm.value = true;
  categoryForm.value = { name: '', isIncome: true };
  currentButtonAndAction.value = {
    buttonText: '新增',
    action: () => addNewCategory(),
  };
};

// info: 關於點擊垃圾桶icon後會出現的list以及它們的事件 -----------
// desc: 點擊垃圾桶icon後會出現的list
const clickModificationIconShowList = (item) => [
  {
    key: '刪除',
    callback: () => deleteCategoryAndParentsComponentRefresh(item._id),
  },
  {
    key: '修改',
    callback: () => {
      console.log('修改分類: ', item);
      isShowAddForm.value = true;
      categoryForm.value = { name: item.name, isIncome: item.isIncome };
      currentButtonAndAction.value = {
        buttonText: '修改',
        action: () => modifyCategory(item._id),
      };
    },
  },
];

const deleteCategoryAndParentsComponentRefresh = async (categoryId) => {
  // 刪除類別的部分
  if (confirm('確定要刪除這個類別嗎?')) {
    console.log('Deleting category with ID: ', categoryId);
    await wrap(async () => {
      try {
        await axios.delete(
          `${process.env.VUE_APP_BACKEND_API_URL}/category/deleteCategory/${categoryId}`,
          { withCredentials: true }
        );
      } catch (e) {
        console.error('刪除類別失敗: ', e);
        alert('刪除類別失敗，請稍後再試。');
      }
    });
  }

  // 刷新父組件的部分(尚未做)
  emit('parentComponentRefreshCategoryData');
};

console.log('clickModificationIconShowList: ', clickModificationIconShowList());
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
