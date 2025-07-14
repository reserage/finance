<template>
  <v-dialog v-model="isShowDialogCategoryManagement" max-width="unset">
    <v-card>
      <v-card-title class="text-h6">分類管理</v-card-title>
      <v-card-text class="d-flex">
        <!-- 桌面板畫面 -->
        <v-row v-if="!isMobile">
          <!-- //desc 新增新分類的form -->
          <v-expand-transition mode="out-in">
            <div v-if="isShowAddForm" class="w-100">
              <v-col class="mb-4" cols="12">
                <v-text-field
                  label="分類名稱"
                  v-model="newCategory.name"
                  required
                ></v-text-field>
                <v-radio-group
                  label="分類類型"
                  v-model="newCategory.isIncome"
                  inline="true"
                >
                  <v-radio label="收入" :value="true"></v-radio>
                  <v-radio label="支出" :value="false"></v-radio>
                </v-radio-group>
                <v-btn @click="isShowAddForm = false" color="grey" class="me-2"
                  >取消</v-btn
                >
                <v-btn type="submit" color="primary" class="me-2">新增</v-btn>
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
        ><v-btn class="text-primary" @click.prevent="isShowAddForm = true"
          >新增</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import {
  defineModel,
  defineProps,
  computed,
  defineEmits,
  ref,
  watch,
} from "vue";
import { useDisplay } from "vuetify";

const props = defineProps(["allCategoriesData"]);
const emit = defineEmits(["parentComponentRefreshCategoryData"]);

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);

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

// info 用於控制對話框顯示的事件
// desc 從父組件傳入的props，控制dialog的顯示
const isShowDialogCategoryManagement = defineModel(
  "isShowDialogCategoryManagement",
  {
    default: false,
    type: Boolean,
  }
);

// info 用於新增分類的form
const isShowAddForm = ref(false);
const newCategory = ref({
  name: "",
  isIncome: true,
});
watch(isShowDialogCategoryManagement, (newVal) => {
  if (!newVal) {
    isShowAddForm.value = false;
    newCategory.value = { name: "", isIncome: true }; // 重置新增分類的表單
  }
});


const deleteCategoryAndParentsComponentRefresh = async (categoryId) => {
  // 刪除類別的部分
  if (confirm("確定要刪除這個類別嗎?")) {
    console.log("Deleting category with ID: ", categoryId);
    try {
      await axios.delete(
        `${process.env.VUE_APP_BACKEND_API_URL}/category/deleteCategory/${categoryId}`,
        { withCredentials: true }
      );
    } catch (e) {
      console.error("刪除類別失敗: ", e);
      alert("刪除類別失敗，請稍後再試。");
    }
  }

  // 刷新父組件的部分(尚未做)
  emit("parentComponentRefreshCategoryData");
};

const clickModificationIconShowList = (item) => [
  {
    key: "刪除",
    callback: () => deleteCategoryAndParentsComponentRefresh(item._id),
  },
  { key: "修改", callback: () => console.log("修改功能尚未實作") },
];

console.log("clickModificationIconShowList: ", clickModificationIconShowList());
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
