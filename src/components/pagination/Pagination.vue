<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <button
          class="page-link"
          aria-label="Previous"
          :disabled="model.currentPage == 1"
          @click="setPage(model.currentPage - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <template v-if="model.showDotsBefore">
        <li class="page-item">
          <button class="page-link" disabled>...</button>
        </li>
      </template>
      <li
        v-for="index in model.visiblePages"
        class="page-item"
        :class="{ active: index == model.currentPage }"
        :key="index"
      >
        <button
          class="page-link"
          :disabled="index == model.currentPage"
          @click="setPage(index)"
        >
          {{ index }}
        </button>
      </li>
      <template v-if="model.showDotsAfter">
        <li class="page-item">
          <button class="page-link" disabled>...</button>
        </li>
      </template>
      <li class="page-item">
        <button
          class="page-link"
          aria-label="Next"
          :disabled="model.currentPage === model.lastPage"
          @click="setPage(model.currentPage + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
/* eslint vue/multi-word-component-names: 0 */
import { type PropType, type Ref, computed } from "vue";
import {
  type PaginationData,
  type PaginationModel,
  toModel,
} from "./Pagination";

const props = defineProps({
  value: {
    type: Object as PropType<PaginationData>,
    default: () => ({ limit: 20, offset: 0, total: 0 }),
  },
});

const model: Ref<PaginationModel> = computed(() => toModel(props.value));
function setPage(page: number) {
  const newOffset = (page - 1) * props.value.limit;
  emit("update:offset", newOffset);
}
const emit = defineEmits<{
  (e: "update:offset", v: number): void;
}>();
</script>
