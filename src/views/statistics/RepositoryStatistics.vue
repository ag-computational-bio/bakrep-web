<template>
  <table class="w-50">
    <tr v-for="(key, index) in Object.keys(entries)" :key="index">
      <th scope="row">
        {{ key.charAt(0).toLocaleUpperCase() + key.slice(1) }}:
      </th>
      <td>{{ entries[key] }}</td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  entries: { type: Object as PropType<Record<string, number>>, required: true },
});
</script>

<style scoped>
th {
  text-align: start;
}

td {
  text-align: start;
}
</style>
