<!-- RecordItem.vue -->
<template>
  <div class="item d-flex justify-content-between align-items-center">
    <div class="sortContainer d-flex gap-4">
      <div class="date">{{ itemInformation.date }}</div>
      <div class="category">{{ itemInformation.category }}</div>
    </div>
    <div class="remarkContainer">
      {{ itemInformation.note }}
    </div>
    <div class="moneyContainer">
      {{ itemInformation.amount }}
      <i class="fa-solid fa-trash" @click="handleDelete"></i>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  itemInformation: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete-item"]);

function handleDelete() {
  emit("delete-item", props.itemInformation.id);
}
</script>

<style>
/* 保持原有樣式不變 */
* {
  /* box-sizing: border-box; */
}

.item {
  width: 100%;
  height: 10%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px black solid;
  margin-bottom: 0.3rem;
}

.moneyContainer i {
  cursor: pointer;
}

.remarkContainer {
  max-width: 30%;
  max-height: 3rem;
  overflow: auto;
  /* 允許滾動 */
  word-wrap: break-word;

  /* 隱藏滾動條 */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE/Edge */
}

.remarkContainer::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari */
}
</style>
