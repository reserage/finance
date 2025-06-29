import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransactionStore = defineStore("transaction", () => {
  const selectedBook = ref(null);

  return {
    selectedBook,
    setSelectedBook(book) {
      selectedBook.value = book;
    },
    clearSelectedBook() {
      selectedBook.value = null;
    },
  };
});
