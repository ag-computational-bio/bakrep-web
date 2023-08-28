<script setup lang="ts">
import type { PropType } from "vue";
type SearchResultEntry = {
  id: string;
  GC: number;
  Contigs: number;
  Length: number;
  Name: string;
};

defineProps({
  entries: { type: Array as PropType<SearchResultEntry[]>, default: () => [] },
});

</script>

<template>
  <div class="rounded bg-light shadow-sm">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">GC</th>
          <th scope="col">Contigs</th>
          <th scope="col">Genome Size</th>
          <th scope="col">Species</th>
          <th scope="col">ST Type</th>
          <th scope="col">Quality & Contamination</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="entry in entries" :key="entry.id">
          <tr
            @click="
              $router.push({
                name: 'result',
                params: { id: entry.id, title: entry.Name },
              })
            "
            class="pointer"
          >
            <td scope="row">{{ entry.id }}</td>
            <td>{{ entry.GC * 100 + "%" }}</td>
            <td>{{ entry.Contigs }}</td>
            <td>
              {{
                Math.round(entry.Length / 1000).toLocaleString("en") + "KB"
              }}
            </td>
            <td>{{ entry.Name }}</td>
            <td class="text-nowrap">ST - Type</td>
            <td>Quality</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style>
.pointer {
  cursor: pointer;
}
</style>
