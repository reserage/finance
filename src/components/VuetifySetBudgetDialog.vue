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
          v-for="(category, index) in fakeCategories"
          :key="index"
          class="mb-4"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="fs-3">{{ category.name }}</span>
            <v-chip :color="getCategoryStatusColor(category)" class="fs-5"
              >{{ category.total }}/{{ category.budget }}
            </v-chip>
          </v-card-title>

          <v-card-text class="py-2">
            <v-progress-linear
              height="20px"
              rounded="true"
              :model-value="category.ratio == -1 ? 0 : category.ratio"
              striped
              :color="category.color"
            >
              <span v-if="category.ratio == -1" style="color: green"
                >未設定預算</span
              >
            </v-progress-linear>
          </v-card-text>

          <v-card-actions>
            <v-btn
              text
              class="fs-5"
              @click.prevent="openSettingBudgetDialog(category.budget)"
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

  <v-dialog v-model="isSettingBudgetDialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">設定預算</v-card-title>
      <v-card-text>
        <v-text-field v-model="setNewBudget" label="設定預算" type="number" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isSettingBudgetDialog = false">取消</v-btn>
        <v-btn text color="primary" @click="isSettingBudgetDialog = false"
          >確認</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, defineModel, defineEmits } from "vue";

const emit = defineEmits(["close"]);

const isShowDialog = defineModel();

const isSettingBudgetDialog = ref(false);

const setNewBudget = ref(0);

// budget 屬性等於 -1 時，代表沒有設定該預算
const fakeCategories = [
  {
    name: "餐飲",
    budget: 0,
    total: 1518,
  },
  { name: "交通", budget: 1500, total: 1200 },
  { name: "娛樂", budget: 800, total: 600 },
  { name: "娛樂", budget: 800, total: 600 },
  { name: "娛樂", budget: 800, total: 600 },
  { name: "娛樂", budget: 800, total: 600 },
  { name: "娛樂", budget: 800, total: 600 },
].map((category) => ({
  ...category,
  ratio:
    category.budget === 0
      ? -1
      : Math.ceil((category.total / category.budget) * 100),
  color: getCategoryStatusColor(category),
}));

console.log("fakeCategories: ", fakeCategories);

function getCategoryStatusColor(category) {
  const ratio = category.budget > 0 ? category.total / category.budget : 0;
  if (ratio < 0.5) return "green";
  else if (ratio <= 0.75) return "orange";
  else return "red";
}

function openSettingBudgetDialog(currentBudget) {
  isSettingBudgetDialog.value = true;
  setNewBudget.value = currentBudget;
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
