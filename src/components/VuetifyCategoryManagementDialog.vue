<template>
  <v-dialog v-model="isShowDialogCategoryManagement" max-width="unset">
    <v-card>
      <v-card-title class="text-h6">分類管理</v-card-title>
      <v-card-text class="d-flex">
        <!-- 桌面板畫面 -->
        <v-row v-if="!isMobile"
          ><v-col cols="12" lg="6"
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
                        <vMenu offset-y>
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
                        </vMenu>
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
                        <vMenu offset-y>
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
                        </vMenu>
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
                        <vMenu offset-y>
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
                        </vMenu>
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
                        <vMenu offset-y>
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
                        </vMenu>
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
        ><v-btn class="text-primary">新增</v-btn></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import { defineModel, defineProps, computed, defineEmits } from "vue";
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

const isShowDialogCategoryManagement = defineModel(
  "isShowDialogCategoryManagement",
  {
    default: false,
    type: Boolean,
  }
);

const deleteCategoryAndParentsComponentRefresh = async (categoryId) => {
  // 刪除類別的部分
  if (confirm("確定要刪除這個類別嗎?")) {
    console.log("Deleting category with ID: ", categoryId);
    try {
      await axios.delete(
        `http://localhost:5000/category/deleteCategory/${categoryId}`,
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
