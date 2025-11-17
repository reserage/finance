import { ref } from 'vue';

export function useLoading() {
  const loading = ref(false);

  async function wrap(asyncFn) {
    loading.value = true;
    const result = await asyncFn();
    loading.value = false;
    return result;
  }

  return { loading, wrap };
}
